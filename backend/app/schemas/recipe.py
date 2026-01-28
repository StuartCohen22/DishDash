"""Pydantic schemas for recipe-related requests and responses."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import IngredientUnit, RecipeCategory


class IngredientBase(BaseModel):
    """Base schema for ingredient data."""

    name: str = Field(..., min_length=1, max_length=200, description="Ingredient name")
    quantity: Decimal = Field(..., gt=0, description="Amount of the ingredient")
    unit: IngredientUnit = Field(..., description="Unit of measurement")


class IngredientCreate(IngredientBase):
    """Schema for creating an ingredient (within a recipe)."""

    order_index: int = Field(default=0, ge=0, description="Display order")


class IngredientResponse(IngredientBase):
    """Schema for ingredient response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    order_index: int


class RecipeBase(BaseModel):
    """Base schema for recipe data."""

    name: str = Field(..., min_length=1, max_length=200, description="Recipe name")
    description: str | None = Field(None, max_length=1000, description="Short description")
    instructions: str = Field(..., min_length=1, description="Cooking instructions")
    prep_time_minutes: int = Field(default=0, ge=0, description="Preparation time in minutes")
    cook_time_minutes: int = Field(default=0, ge=0, description="Cooking time in minutes")
    servings: int = Field(default=1, ge=1, description="Number of servings")
    category: RecipeCategory = Field(..., description="Recipe category")


class RecipeCreate(RecipeBase):
    """Schema for creating a new recipe."""

    ingredients: list[IngredientCreate] = Field(
        default_factory=list,
        description="List of ingredients",
    )


class RecipeUpdate(BaseModel):
    """Schema for updating a recipe (all fields optional)."""

    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = Field(None, max_length=1000)
    instructions: str | None = Field(None, min_length=1)
    prep_time_minutes: int | None = Field(None, ge=0)
    cook_time_minutes: int | None = Field(None, ge=0)
    servings: int | None = Field(None, ge=1)
    category: RecipeCategory | None = None
    ingredients: list[IngredientCreate] | None = None


class RecipeResponse(RecipeBase):
    """Schema for recipe response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    ingredients: list[IngredientResponse]
    created_at: datetime
    updated_at: datetime

    @property
    def total_time_minutes(self) -> int:
        """Calculate total cooking time."""
        return self.prep_time_minutes + self.cook_time_minutes


class RecipeListResponse(BaseModel):
    """Schema for paginated recipe list response."""

    items: list[RecipeResponse]
    total: int
    page: int
    page_size: int
    pages: int


class CategoryListResponse(BaseModel):
    """Schema for listing available recipe categories."""

    categories: list[dict[str, str]]
