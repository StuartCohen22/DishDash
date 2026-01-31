"""Pydantic schemas for meal plan-related requests and responses."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.recipe import RecipeResponse
from app.utils.enums import MealType


class PlannedMealCreate(BaseModel):
    """Schema for adding a meal to a plan."""

    recipe_id: UUID = Field(..., description="ID of the recipe to add")
    day_of_week: int = Field(..., ge=0, le=6, description="Day of week (0=Monday, 6=Sunday)")
    meal_type: MealType = Field(..., description="Type of meal")


class PlannedMealResponse(BaseModel):
    """Schema for planned meal response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    recipe_id: UUID
    day_of_week: int
    meal_type: MealType
    recipe: RecipeResponse
    created_at: datetime


class MealPlanCreate(BaseModel):
    """Schema for creating a new meal plan."""

    name: str = Field(..., min_length=1, max_length=200, description="Name of the meal plan")
    week_start_date: date = Field(..., description="Monday of the week this plan covers")


class MealPlanUpdate(BaseModel):
    """Schema for updating a meal plan (all fields optional)."""

    name: str | None = Field(None, min_length=1, max_length=200)
    week_start_date: date | None = None


class ShoppingListSummary(BaseModel):
    """Summary of shopping list for meal plan response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    generated_at: datetime
    item_count: int = 0


class MealPlanResponse(BaseModel):
    """Schema for meal plan response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    name: str
    week_start_date: date
    planned_meals: list[PlannedMealResponse] = []
    shopping_list: ShoppingListSummary | None = None
    created_at: datetime
    updated_at: datetime


class MealPlanListResponse(BaseModel):
    """Schema for meal plan list response."""

    items: list[MealPlanResponse]
    total: int
