"""Pydantic schemas for shopping list-related requests and responses."""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ShoppingItemResponse(BaseModel):
    """Schema for shopping item response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ingredient_name: str
    quantity: Decimal
    unit: str
    is_purchased: bool
    is_pantry_item: bool = Field(
        default=False,
        description="Whether this is a pantry item (spices in small amounts)"
    )
    created_at: datetime


class ShoppingItemUpdate(BaseModel):
    """Schema for updating a shopping item."""

    is_purchased: bool = Field(..., description="Whether the item has been purchased")


class ShoppingListResponse(BaseModel):
    """Schema for shopping list response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    meal_plan_id: UUID
    generated_at: datetime
    updated_at: datetime
    items: list[ShoppingItemResponse] = []
    to_buy_count: int = 0
    pantry_count: int = 0
    purchased_count: int = 0
