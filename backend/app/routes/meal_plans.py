"""Meal plan routes for CRUD operations."""

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.dependencies import CurrentUser, DbSession
from app.schemas.meal_plan import (
    MealPlanCreate,
    MealPlanListResponse,
    MealPlanResponse,
    MealPlanUpdate,
    PlannedMealCreate,
    PlannedMealResponse,
    ShoppingListSummary,
)
from app.services.meal_plan import MealPlanService

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])


@router.get(
    "",
    response_model=MealPlanListResponse,
    summary="List meal plans",
    description="Get all meal plans for the current user.",
)
async def list_meal_plans(
    current_user: CurrentUser,
    db: DbSession,
) -> MealPlanListResponse:
    """List all meal plans for the authenticated user."""
    plans = await MealPlanService.get_meal_plans(
        db=db,
        user_id=current_user.id,
    )

    # Convert to response models with shopping list summary
    items = []
    for plan in plans:
        plan_dict = {
            "id": plan.id,
            "user_id": plan.user_id,
            "name": plan.name,
            "week_start_date": plan.week_start_date,
            "planned_meals": plan.planned_meals,
            "created_at": plan.created_at,
            "updated_at": plan.updated_at,
            "shopping_list": None,
        }
        if plan.shopping_list:
            plan_dict["shopping_list"] = ShoppingListSummary(
                id=plan.shopping_list.id,
                generated_at=plan.shopping_list.generated_at,
                item_count=len(plan.shopping_list.items) if plan.shopping_list.items else 0,
            )
        items.append(MealPlanResponse.model_validate(plan_dict))

    return MealPlanListResponse(items=items, total=len(items))


@router.post(
    "",
    response_model=MealPlanResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create meal plan",
    description="Create a new meal plan.",
)
async def create_meal_plan(
    plan_data: MealPlanCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> MealPlanResponse:
    """
    Create a new meal plan.

    - **name**: Name for the meal plan
    - **week_start_date**: Monday of the week this plan covers
    """
    plan = await MealPlanService.create_meal_plan(
        db=db,
        user_id=current_user.id,
        plan_data=plan_data,
    )
    return MealPlanResponse.model_validate(plan)


@router.get(
    "/{plan_id}",
    response_model=MealPlanResponse,
    summary="Get meal plan",
    description="Get a single meal plan with all its planned meals.",
)
async def get_meal_plan(
    plan_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MealPlanResponse:
    """Get a single meal plan by its ID."""
    plan = await MealPlanService.get_meal_plan_by_id(
        db=db,
        plan_id=plan_id,
        user_id=current_user.id,
    )

    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found",
        )

    # Build response with shopping list summary
    plan_dict = {
        "id": plan.id,
        "user_id": plan.user_id,
        "name": plan.name,
        "week_start_date": plan.week_start_date,
        "planned_meals": plan.planned_meals,
        "created_at": plan.created_at,
        "updated_at": plan.updated_at,
        "shopping_list": None,
    }
    if plan.shopping_list:
        plan_dict["shopping_list"] = ShoppingListSummary(
            id=plan.shopping_list.id,
            generated_at=plan.shopping_list.generated_at,
            item_count=len(plan.shopping_list.items) if plan.shopping_list.items else 0,
        )

    return MealPlanResponse.model_validate(plan_dict)


@router.put(
    "/{plan_id}",
    response_model=MealPlanResponse,
    summary="Update meal plan",
    description="Update an existing meal plan.",
)
async def update_meal_plan(
    plan_id: UUID,
    plan_data: MealPlanUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> MealPlanResponse:
    """
    Update an existing meal plan.

    All fields are optional - only provided fields will be updated.
    """
    plan = await MealPlanService.get_meal_plan_by_id(
        db=db,
        plan_id=plan_id,
        user_id=current_user.id,
    )

    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found",
        )

    updated_plan = await MealPlanService.update_meal_plan(
        db=db,
        meal_plan=plan,
        plan_data=plan_data,
    )

    return MealPlanResponse.model_validate(updated_plan)


@router.delete(
    "/{plan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete meal plan",
    description="Delete a meal plan and all its planned meals.",
)
async def delete_meal_plan(
    plan_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """Delete a meal plan by its ID."""
    plan = await MealPlanService.get_meal_plan_by_id(
        db=db,
        plan_id=plan_id,
        user_id=current_user.id,
    )

    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found",
        )

    await MealPlanService.delete_meal_plan(db=db, meal_plan=plan)


@router.post(
    "/{plan_id}/meals",
    response_model=PlannedMealResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add meal to plan",
    description="Add a recipe to a specific day and meal slot.",
)
async def add_meal(
    plan_id: UUID,
    meal_data: PlannedMealCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> PlannedMealResponse:
    """
    Add a recipe to a meal plan slot.

    - **recipe_id**: ID of the recipe to add
    - **day_of_week**: 0 (Monday) through 6 (Sunday)
    - **meal_type**: breakfast, lunch, dinner, or snack

    If the slot is already occupied, it will be replaced.
    """
    planned_meal = await MealPlanService.add_meal(
        db=db,
        user_id=current_user.id,
        plan_id=plan_id,
        meal_data=meal_data,
    )

    if not planned_meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan or recipe not found",
        )

    # Reload with recipe relationship
    plan = await MealPlanService.get_meal_plan_by_id(
        db=db,
        plan_id=plan_id,
        user_id=current_user.id,
    )

    # Find the meal we just added/updated
    for meal in plan.planned_meals:
        if meal.id == planned_meal.id:
            return PlannedMealResponse.model_validate(meal)

    # Fallback (shouldn't happen)
    return PlannedMealResponse.model_validate(planned_meal)


# Separate router for planned meals without plan prefix
planned_meals_router = APIRouter(prefix="/planned-meals", tags=["Meal Plans"])


@planned_meals_router.delete(
    "/{meal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove meal from plan",
    description="Remove a planned meal from a meal plan.",
)
async def remove_meal(
    meal_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """Remove a planned meal by its ID."""
    deleted = await MealPlanService.remove_meal(
        db=db,
        user_id=current_user.id,
        meal_id=meal_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Planned meal not found",
        )
