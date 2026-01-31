"""Meal plan service for business logic operations."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.meal_plan import MealPlan, PlannedMeal
from app.models.recipe import Recipe
from app.schemas.meal_plan import MealPlanCreate, MealPlanUpdate, PlannedMealCreate


class MealPlanService:
    """Service class for meal plan operations."""

    @staticmethod
    async def get_meal_plans(
        db: AsyncSession,
        user_id: UUID,
    ) -> list[MealPlan]:
        """
        Get all meal plans for a user.

        Args:
            db: Database session
            user_id: User's UUID

        Returns:
            List of meal plans
        """
        query = (
            select(MealPlan)
            .options(
                selectinload(MealPlan.planned_meals).selectinload(PlannedMeal.recipe),
                selectinload(MealPlan.shopping_list),
            )
            .where(MealPlan.user_id == user_id)
            .order_by(MealPlan.week_start_date.desc())
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_meal_plan_by_id(
        db: AsyncSession,
        plan_id: UUID,
        user_id: UUID,
    ) -> MealPlan | None:
        """
        Get a single meal plan by ID.

        Args:
            db: Database session
            plan_id: MealPlan's UUID
            user_id: User's UUID (for ownership check)

        Returns:
            MealPlan object or None if not found
        """
        query = (
            select(MealPlan)
            .options(
                selectinload(MealPlan.planned_meals)
                .selectinload(PlannedMeal.recipe)
                .selectinload(Recipe.ingredients),
                selectinload(MealPlan.shopping_list),
            )
            .where(MealPlan.id == plan_id, MealPlan.user_id == user_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_meal_plan(
        db: AsyncSession,
        user_id: UUID,
        plan_data: MealPlanCreate,
    ) -> MealPlan:
        """
        Create a new meal plan.

        Args:
            db: Database session
            user_id: User's UUID
            plan_data: Meal plan creation data

        Returns:
            Created MealPlan object
        """
        meal_plan = MealPlan(
            user_id=user_id,
            name=plan_data.name,
            week_start_date=plan_data.week_start_date,
        )
        db.add(meal_plan)
        await db.flush()
        await db.refresh(meal_plan)
        return meal_plan

    @staticmethod
    async def update_meal_plan(
        db: AsyncSession,
        meal_plan: MealPlan,
        plan_data: MealPlanUpdate,
    ) -> MealPlan:
        """
        Update an existing meal plan.

        Args:
            db: Database session
            meal_plan: MealPlan object to update
            plan_data: Update data

        Returns:
            Updated MealPlan object
        """
        update_data = plan_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(meal_plan, field, value)

        await db.flush()
        await db.refresh(meal_plan)
        return meal_plan

    @staticmethod
    async def delete_meal_plan(
        db: AsyncSession,
        meal_plan: MealPlan,
    ) -> None:
        """
        Delete a meal plan (planned meals and shopping list cascade automatically).

        Args:
            db: Database session
            meal_plan: MealPlan object to delete
        """
        await db.delete(meal_plan)
        await db.flush()

    @staticmethod
    async def add_meal(
        db: AsyncSession,
        user_id: UUID,
        plan_id: UUID,
        meal_data: PlannedMealCreate,
    ) -> PlannedMeal | None:
        """
        Add a recipe to a meal plan slot.

        Args:
            db: Database session
            user_id: User's UUID
            plan_id: MealPlan's UUID
            meal_data: Planned meal data

        Returns:
            Created PlannedMeal object or None if plan/recipe not found
        """
        # Verify meal plan ownership
        plan = await MealPlanService.get_meal_plan_by_id(db, plan_id, user_id)
        if not plan:
            return None

        # Verify recipe ownership
        recipe_query = select(Recipe).where(
            Recipe.id == meal_data.recipe_id,
            Recipe.user_id == user_id,
        )
        result = await db.execute(recipe_query)
        recipe = result.scalar_one_or_none()
        if not recipe:
            return None

        # Check if slot is already occupied
        existing_query = select(PlannedMeal).where(
            PlannedMeal.meal_plan_id == plan_id,
            PlannedMeal.day_of_week == meal_data.day_of_week,
            PlannedMeal.meal_type == meal_data.meal_type,
        )
        existing_result = await db.execute(existing_query)
        existing = existing_result.scalar_one_or_none()

        if existing:
            # Replace existing meal
            existing.recipe_id = meal_data.recipe_id
            await db.flush()
            await db.refresh(existing)
            return existing

        # Create new planned meal
        planned_meal = PlannedMeal(
            meal_plan_id=plan_id,
            recipe_id=meal_data.recipe_id,
            day_of_week=meal_data.day_of_week,
            meal_type=meal_data.meal_type,
        )
        db.add(planned_meal)
        await db.flush()
        await db.refresh(planned_meal)
        return planned_meal

    @staticmethod
    async def remove_meal(
        db: AsyncSession,
        user_id: UUID,
        meal_id: UUID,
    ) -> bool:
        """
        Remove a meal from a plan.

        Args:
            db: Database session
            user_id: User's UUID
            meal_id: PlannedMeal's UUID

        Returns:
            True if deleted, False if not found
        """
        # Get planned meal with ownership check
        query = (
            select(PlannedMeal)
            .join(MealPlan)
            .where(PlannedMeal.id == meal_id, MealPlan.user_id == user_id)
        )
        result = await db.execute(query)
        planned_meal = result.scalar_one_or_none()

        if not planned_meal:
            return False

        await db.delete(planned_meal)
        await db.flush()
        return True
