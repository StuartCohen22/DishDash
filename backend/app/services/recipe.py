"""Recipe service for business logic operations."""

from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.recipe import Ingredient, Recipe
from app.schemas.recipe import IngredientCreate, RecipeCreate, RecipeUpdate
from app.utils.enums import RecipeCategory


class RecipeService:
    """Service class for recipe operations."""

    @staticmethod
    async def get_recipes(
        db: AsyncSession,
        user_id: UUID,
        page: int = 1,
        page_size: int = 10,
        category: RecipeCategory | None = None,
        search: str | None = None,
    ) -> tuple[list[Recipe], int]:
        """
        Get paginated list of recipes for a user.

        Args:
            db: Database session
            user_id: User's UUID
            page: Page number (1-indexed)
            page_size: Items per page
            category: Optional category filter
            search: Optional search term for name

        Returns:
            Tuple of (recipes list, total count)
        """
        # Base query
        query = select(Recipe).where(Recipe.user_id == user_id)

        # Apply filters
        if category:
            query = query.where(Recipe.category == category)
        if search:
            query = query.where(Recipe.name.ilike(f"%{search}%"))

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Apply pagination and ordering
        query = (
            query.options(selectinload(Recipe.ingredients))
            .order_by(Recipe.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        result = await db.execute(query)
        recipes = list(result.scalars().all())

        return recipes, total

    @staticmethod
    async def get_recipe_by_id(
        db: AsyncSession,
        recipe_id: UUID,
        user_id: UUID,
    ) -> Recipe | None:
        """
        Get a single recipe by ID.

        Args:
            db: Database session
            recipe_id: Recipe's UUID
            user_id: User's UUID (for ownership check)

        Returns:
            Recipe object or None if not found
        """
        query = (
            select(Recipe)
            .options(selectinload(Recipe.ingredients))
            .where(Recipe.id == recipe_id, Recipe.user_id == user_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_recipe(
        db: AsyncSession,
        user_id: UUID,
        recipe_data: RecipeCreate,
    ) -> Recipe:
        """
        Create a new recipe with ingredients.

        Args:
            db: Database session
            user_id: User's UUID
            recipe_data: Recipe creation data

        Returns:
            Created Recipe object
        """
        # Create recipe
        recipe = Recipe(
            user_id=user_id,
            name=recipe_data.name,
            description=recipe_data.description,
            instructions=recipe_data.instructions,
            prep_time_minutes=recipe_data.prep_time_minutes,
            cook_time_minutes=recipe_data.cook_time_minutes,
            servings=recipe_data.servings,
            category=recipe_data.category,
        )
        db.add(recipe)
        await db.flush()

        # Create ingredients
        for idx, ing_data in enumerate(recipe_data.ingredients):
            ingredient = Ingredient(
                recipe_id=recipe.id,
                name=ing_data.name,
                quantity=ing_data.quantity,
                unit=ing_data.unit,
                order_index=ing_data.order_index if ing_data.order_index else idx,
            )
            db.add(ingredient)

        await db.flush()
        await db.refresh(recipe)

        return recipe

    @staticmethod
    async def update_recipe(
        db: AsyncSession,
        recipe: Recipe,
        recipe_data: RecipeUpdate,
    ) -> Recipe:
        """
        Update an existing recipe.

        Args:
            db: Database session
            recipe: Recipe object to update
            recipe_data: Update data

        Returns:
            Updated Recipe object
        """
        # Update recipe fields
        update_data = recipe_data.model_dump(exclude_unset=True, exclude={"ingredients"})
        for field, value in update_data.items():
            setattr(recipe, field, value)

        # Update ingredients if provided
        if recipe_data.ingredients is not None:
            # Delete existing ingredients
            await db.execute(
                delete(Ingredient).where(Ingredient.recipe_id == recipe.id)
            )

            # Add new ingredients
            for idx, ing_data in enumerate(recipe_data.ingredients):
                ingredient = Ingredient(
                    recipe_id=recipe.id,
                    name=ing_data.name,
                    quantity=ing_data.quantity,
                    unit=ing_data.unit,
                    order_index=ing_data.order_index if ing_data.order_index else idx,
                )
                db.add(ingredient)

        await db.flush()
        await db.refresh(recipe)

        return recipe

    @staticmethod
    async def delete_recipe(
        db: AsyncSession,
        recipe: Recipe,
    ) -> None:
        """
        Delete a recipe (ingredients cascade automatically).

        Args:
            db: Database session
            recipe: Recipe object to delete
        """
        await db.delete(recipe)
        await db.flush()

    @staticmethod
    def get_categories() -> list[dict[str, str]]:
        """Get list of available recipe categories."""
        return [
            {"value": cat.value, "label": cat.value.capitalize()}
            for cat in RecipeCategory
        ]
