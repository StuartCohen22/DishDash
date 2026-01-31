"""Shopping list routes for CRUD operations."""

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.dependencies import CurrentUser, DbSession
from app.schemas.shopping import (
    ShoppingItemResponse,
    ShoppingItemUpdate,
    ShoppingListResponse,
)
from app.services.shopping import ShoppingService, is_pantry_item

router = APIRouter(tags=["Shopping Lists"])


@router.post(
    "/meal-plans/{plan_id}/shopping-list",
    response_model=ShoppingListResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate shopping list",
    description="Generate a shopping list from a meal plan's recipes.",
)
async def generate_shopping_list(
    plan_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> ShoppingListResponse:
    """
    Generate a shopping list from a meal plan.

    - Aggregates all ingredients from planned meals
    - Groups by ingredient name and unit
    - Sums quantities for matching ingredients
    - Flags pantry items (spices in small amounts)

    If a shopping list already exists, it will be regenerated.
    """
    shopping_list = await ShoppingService.generate_shopping_list(
        db=db,
        user_id=current_user.id,
        plan_id=plan_id,
    )

    if not shopping_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan not found",
        )

    return _build_shopping_list_response(shopping_list)


@router.get(
    "/shopping-lists/{list_id}",
    response_model=ShoppingListResponse,
    summary="Get shopping list",
    description="Get a shopping list by ID.",
)
async def get_shopping_list(
    list_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> ShoppingListResponse:
    """Get a shopping list by its ID."""
    shopping_list = await ShoppingService.get_shopping_list(
        db=db,
        user_id=current_user.id,
        list_id=list_id,
    )

    if not shopping_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list not found",
        )

    return _build_shopping_list_response(shopping_list)


@router.get(
    "/meal-plans/{plan_id}/shopping-list",
    response_model=ShoppingListResponse,
    summary="Get shopping list by plan",
    description="Get the shopping list for a meal plan.",
)
async def get_shopping_list_by_plan(
    plan_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> ShoppingListResponse:
    """Get a shopping list by meal plan ID."""
    shopping_list = await ShoppingService.get_shopping_list_by_plan(
        db=db,
        user_id=current_user.id,
        plan_id=plan_id,
    )

    if not shopping_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list not found for this meal plan",
        )

    return _build_shopping_list_response(shopping_list)


@router.patch(
    "/shopping-items/{item_id}",
    response_model=ShoppingItemResponse,
    summary="Update shopping item",
    description="Toggle the purchased status of a shopping item.",
)
async def update_shopping_item(
    item_id: UUID,
    item_data: ShoppingItemUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> ShoppingItemResponse:
    """Update a shopping item (toggle purchased status)."""
    item = await ShoppingService.update_item(
        db=db,
        user_id=current_user.id,
        item_id=item_id,
        item_data=item_data,
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping item not found",
        )

    return ShoppingItemResponse(
        id=item.id,
        ingredient_name=item.ingredient_name,
        quantity=item.quantity,
        unit=item.unit,
        is_purchased=item.is_purchased,
        is_pantry_item=is_pantry_item(item.ingredient_name, item.unit),
        created_at=item.created_at,
    )


@router.delete(
    "/shopping-items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete shopping item",
    description="Remove an item from the shopping list.",
)
async def delete_shopping_item(
    item_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """Delete a shopping item by its ID."""
    deleted = await ShoppingService.delete_item(
        db=db,
        user_id=current_user.id,
        item_id=item_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping item not found",
        )


def _build_shopping_list_response(shopping_list) -> ShoppingListResponse:
    """Build ShoppingListResponse with computed fields."""
    items = []
    to_buy_count = 0
    pantry_count = 0
    purchased_count = 0

    for item in shopping_list.items:
        is_pantry = is_pantry_item(item.ingredient_name, item.unit)
        items.append(ShoppingItemResponse(
            id=item.id,
            ingredient_name=item.ingredient_name,
            quantity=item.quantity,
            unit=item.unit,
            is_purchased=item.is_purchased,
            is_pantry_item=is_pantry,
            created_at=item.created_at,
        ))

        if item.is_purchased:
            purchased_count += 1
        elif is_pantry:
            pantry_count += 1
        else:
            to_buy_count += 1

    return ShoppingListResponse(
        id=shopping_list.id,
        meal_plan_id=shopping_list.meal_plan_id,
        generated_at=shopping_list.generated_at,
        updated_at=shopping_list.updated_at,
        items=items,
        to_buy_count=to_buy_count,
        pantry_count=pantry_count,
        purchased_count=purchased_count,
    )
