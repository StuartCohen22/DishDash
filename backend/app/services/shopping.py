"""Shopping list service for business logic operations."""

from collections import defaultdict
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.meal_plan import MealPlan, PlannedMeal
from app.models.recipe import Recipe
from app.models.shopping import ShoppingItem, ShoppingList
from app.schemas.shopping import ShoppingItemUpdate
from app.utils.enums import IngredientUnit


# Units that indicate small amounts (likely pantry items when combined with spices)
SMALL_AMOUNT_UNITS = {
    IngredientUnit.TEASPOON.value,
    IngredientUnit.TABLESPOON.value,
    IngredientUnit.PINCH.value,
    IngredientUnit.DASH.value,
    IngredientUnit.TO_TASTE.value,
}

# Common pantry/spice keywords (case-insensitive)
PANTRY_KEYWORDS = {
    # Spices
    "salt", "pepper", "paprika", "cinnamon", "cumin", "oregano", "basil",
    "thyme", "rosemary", "parsley", "cilantro", "dill", "bay leaf",
    "cayenne", "chili powder", "chili flakes", "red pepper flakes",
    "turmeric", "ginger", "nutmeg", "allspice", "cloves", "cardamom",
    "coriander", "fennel", "mustard", "saffron", "curry",
    # Powder forms
    "garlic powder", "onion powder", "cocoa powder", "baking powder",
    "baking soda",
    # Common seasonings
    "black pepper", "white pepper", "sea salt", "kosher salt",
    "italian seasoning", "herbs de provence", "cajun seasoning",
    "taco seasoning", "old bay",
    # Extracts
    "vanilla extract", "vanilla", "almond extract",
    # Sugar types for baking (small amounts)
    "brown sugar", "powdered sugar", "confectioners sugar",
}


def is_pantry_item(ingredient_name: str, unit: str) -> bool:
    """
    Determine if an ingredient should be flagged as a pantry item.

    Logic:
    - If unit is small (tsp, tbsp, pinch, dash, to_taste)
    - AND ingredient name matches pantry keywords
    - Then it's a pantry item (user likely already has it)

    Args:
        ingredient_name: Name of the ingredient
        unit: Unit of measurement

    Returns:
        True if this is a pantry item
    """
    if unit not in SMALL_AMOUNT_UNITS:
        return False

    name_lower = ingredient_name.lower().strip()

    # Check if any pantry keyword is in the ingredient name
    for keyword in PANTRY_KEYWORDS:
        if keyword in name_lower or name_lower in keyword:
            return True

    return False


class ShoppingService:
    """Service class for shopping list operations."""

    @staticmethod
    async def generate_shopping_list(
        db: AsyncSession,
        user_id: UUID,
        plan_id: UUID,
    ) -> ShoppingList | None:
        """
        Generate a shopping list from a meal plan.
        Aggregates ingredients and flags pantry items.

        Args:
            db: Database session
            user_id: User's UUID
            plan_id: MealPlan's UUID

        Returns:
            Created/updated ShoppingList or None if plan not found
        """
        # Get meal plan with all related data
        query = (
            select(MealPlan)
            .options(
                selectinload(MealPlan.planned_meals)
                .selectinload(PlannedMeal.recipe)
                .selectinload(Recipe.ingredients),
                selectinload(MealPlan.shopping_list)
                .selectinload(ShoppingList.items),
            )
            .where(MealPlan.id == plan_id, MealPlan.user_id == user_id)
        )
        result = await db.execute(query)
        meal_plan = result.scalar_one_or_none()

        if not meal_plan:
            return None

        # Delete existing shopping list items if present
        if meal_plan.shopping_list:
            for item in meal_plan.shopping_list.items:
                await db.delete(item)
            await db.delete(meal_plan.shopping_list)
            await db.flush()

        # Aggregate ingredients
        # Key: (ingredient_name_lower, unit) -> list of quantities
        aggregated: dict[tuple[str, str], list[Decimal]] = defaultdict(list)
        original_names: dict[str, str] = {}  # lowercase -> original case

        for planned_meal in meal_plan.planned_meals:
            recipe = planned_meal.recipe
            for ingredient in recipe.ingredients:
                key = (ingredient.name.lower().strip(), ingredient.unit.value)
                aggregated[key].append(ingredient.quantity)
                # Keep original case from first occurrence
                if ingredient.name.lower().strip() not in original_names:
                    original_names[ingredient.name.lower().strip()] = ingredient.name

        # Create new shopping list
        shopping_list = ShoppingList(meal_plan_id=plan_id)
        db.add(shopping_list)
        await db.flush()

        # Create shopping items
        for (name_lower, unit), quantities in aggregated.items():
            total_quantity = sum(quantities, Decimal("0"))
            original_name = original_names.get(name_lower, name_lower)

            item = ShoppingItem(
                shopping_list_id=shopping_list.id,
                ingredient_name=original_name,
                quantity=total_quantity,
                unit=unit,
                is_purchased=False,
            )
            db.add(item)

        await db.flush()
        await db.refresh(shopping_list)
        return shopping_list

    @staticmethod
    async def get_shopping_list(
        db: AsyncSession,
        user_id: UUID,
        list_id: UUID,
    ) -> ShoppingList | None:
        """
        Get a shopping list by ID.

        Args:
            db: Database session
            user_id: User's UUID
            list_id: ShoppingList's UUID

        Returns:
            ShoppingList object or None if not found
        """
        query = (
            select(ShoppingList)
            .join(MealPlan)
            .options(selectinload(ShoppingList.items))
            .where(ShoppingList.id == list_id, MealPlan.user_id == user_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_shopping_list_by_plan(
        db: AsyncSession,
        user_id: UUID,
        plan_id: UUID,
    ) -> ShoppingList | None:
        """
        Get a shopping list by meal plan ID.

        Args:
            db: Database session
            user_id: User's UUID
            plan_id: MealPlan's UUID

        Returns:
            ShoppingList object or None if not found
        """
        query = (
            select(ShoppingList)
            .join(MealPlan)
            .options(selectinload(ShoppingList.items))
            .where(ShoppingList.meal_plan_id == plan_id, MealPlan.user_id == user_id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def update_item(
        db: AsyncSession,
        user_id: UUID,
        item_id: UUID,
        item_data: ShoppingItemUpdate,
    ) -> ShoppingItem | None:
        """
        Update a shopping item (toggle purchased status).

        Args:
            db: Database session
            user_id: User's UUID
            item_id: ShoppingItem's UUID
            item_data: Update data

        Returns:
            Updated ShoppingItem or None if not found
        """
        query = (
            select(ShoppingItem)
            .join(ShoppingList)
            .join(MealPlan)
            .where(ShoppingItem.id == item_id, MealPlan.user_id == user_id)
        )
        result = await db.execute(query)
        item = result.scalar_one_or_none()

        if not item:
            return None

        item.is_purchased = item_data.is_purchased
        await db.flush()
        await db.refresh(item)
        return item

    @staticmethod
    async def delete_item(
        db: AsyncSession,
        user_id: UUID,
        item_id: UUID,
    ) -> bool:
        """
        Delete a shopping item.

        Args:
            db: Database session
            user_id: User's UUID
            item_id: ShoppingItem's UUID

        Returns:
            True if deleted, False if not found
        """
        query = (
            select(ShoppingItem)
            .join(ShoppingList)
            .join(MealPlan)
            .where(ShoppingItem.id == item_id, MealPlan.user_id == user_id)
        )
        result = await db.execute(query)
        item = result.scalar_one_or_none()

        if not item:
            return False

        await db.delete(item)
        await db.flush()
        return True

    @staticmethod
    def enrich_item_with_pantry_flag(item: ShoppingItem) -> dict:
        """
        Add is_pantry_item flag to item data.

        Args:
            item: ShoppingItem object

        Returns:
            Dict with item data plus is_pantry_item flag
        """
        return {
            "id": item.id,
            "ingredient_name": item.ingredient_name,
            "quantity": item.quantity,
            "unit": item.unit,
            "is_purchased": item.is_purchased,
            "is_pantry_item": is_pantry_item(item.ingredient_name, item.unit),
            "created_at": item.created_at,
        }
