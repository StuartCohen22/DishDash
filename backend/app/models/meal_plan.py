"""MealPlan and PlannedMeal models."""

import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.utils.enums import MealType

if TYPE_CHECKING:
    from app.models.recipe import Recipe
    from app.models.shopping import ShoppingList
    from app.models.user import User


class MealPlan(UUIDMixin, TimestampMixin, Base):
    """MealPlan model for weekly meal planning."""

    __tablename__ = "meal_plans"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    week_start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="meal_plans",
    )
    planned_meals: Mapped[list["PlannedMeal"]] = relationship(
        "PlannedMeal",
        back_populates="meal_plan",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="PlannedMeal.day_of_week, PlannedMeal.meal_type",
    )
    shopping_list: Mapped["ShoppingList | None"] = relationship(
        "ShoppingList",
        back_populates="meal_plan",
        cascade="all, delete-orphan",
        uselist=False,
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<MealPlan {self.name} ({self.week_start_date})>"


class PlannedMeal(UUIDMixin, Base):
    """PlannedMeal model linking recipes to specific meal slots in a plan."""

    __tablename__ = "planned_meals"

    meal_plan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("meal_plans.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    recipe_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    day_of_week: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )  # 0 = Monday, 6 = Sunday
    meal_type: Mapped[MealType] = mapped_column(
        Enum(MealType, name="meal_type"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
    )

    # Relationships
    meal_plan: Mapped["MealPlan"] = relationship(
        "MealPlan",
        back_populates="planned_meals",
    )
    recipe: Mapped["Recipe"] = relationship(
        "Recipe",
        back_populates="planned_meals",
    )

    def __repr__(self) -> str:
        return f"<PlannedMeal day={self.day_of_week} type={self.meal_type.value}>"
