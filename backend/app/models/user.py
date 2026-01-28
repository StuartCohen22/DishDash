"""User model."""

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.meal_plan import MealPlan
    from app.models.recipe import Recipe


class User(UUIDMixin, TimestampMixin, Base):
    """User model for authentication and data ownership."""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # Relationships
    recipes: Mapped[list["Recipe"]] = relationship(
        "Recipe",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    meal_plans: Mapped[list["MealPlan"]] = relationship(
        "MealPlan",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<User {self.email}>"
