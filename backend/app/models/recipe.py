"""Recipe and Ingredient models."""

import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.utils.enums import IngredientUnit, RecipeCategory

if TYPE_CHECKING:
    from app.models.meal_plan import PlannedMeal
    from app.models.user import User


class Recipe(UUIDMixin, TimestampMixin, Base):
    """Recipe model containing cooking instructions and metadata."""

    __tablename__ = "recipes"

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
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    instructions: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    prep_time_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    cook_time_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    servings: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    category: Mapped[RecipeCategory] = mapped_column(
        Enum(RecipeCategory, name="recipe_category"),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="recipes",
    )
    ingredients: Mapped[list["Ingredient"]] = relationship(
        "Ingredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="Ingredient.order_index",
    )
    planned_meals: Mapped[list["PlannedMeal"]] = relationship(
        "PlannedMeal",
        back_populates="recipe",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @property
    def total_time_minutes(self) -> int:
        """Calculate total cooking time."""
        return self.prep_time_minutes + self.cook_time_minutes

    def __repr__(self) -> str:
        return f"<Recipe {self.name}>"


class Ingredient(UUIDMixin, Base):
    """Ingredient model for recipe components."""

    __tablename__ = "ingredients"

    recipe_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    quantity: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )
    unit: Mapped[IngredientUnit] = mapped_column(
        Enum(IngredientUnit, name="ingredient_unit"),
        nullable=False,
    )
    order_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    # Relationships
    recipe: Mapped["Recipe"] = relationship(
        "Recipe",
        back_populates="ingredients",
    )

    def __repr__(self) -> str:
        return f"<Ingredient {self.quantity} {self.unit.value} {self.name}>"
