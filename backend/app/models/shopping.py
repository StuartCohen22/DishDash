"""ShoppingList and ShoppingItem models."""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDMixin

if TYPE_CHECKING:
    from app.models.meal_plan import MealPlan


class ShoppingList(UUIDMixin, Base):
    """ShoppingList model generated from a meal plan."""

    __tablename__ = "shopping_lists"

    meal_plan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("meal_plans.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    generated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # Relationships
    meal_plan: Mapped["MealPlan"] = relationship(
        "MealPlan",
        back_populates="shopping_list",
    )
    items: Mapped[list["ShoppingItem"]] = relationship(
        "ShoppingItem",
        back_populates="shopping_list",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="ShoppingItem.ingredient_name",
    )

    def __repr__(self) -> str:
        return f"<ShoppingList for plan {self.meal_plan_id}>"


class ShoppingItem(UUIDMixin, Base):
    """ShoppingItem model for individual shopping list items."""

    __tablename__ = "shopping_items"

    shopping_list_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("shopping_lists.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    ingredient_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    quantity: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    is_purchased: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
    )

    # Relationships
    shopping_list: Mapped["ShoppingList"] = relationship(
        "ShoppingList",
        back_populates="items",
    )

    def __repr__(self) -> str:
        status = "purchased" if self.is_purchased else "pending"
        return f"<ShoppingItem {self.quantity} {self.unit} {self.ingredient_name} ({status})>"
