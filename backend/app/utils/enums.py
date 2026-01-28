"""Enumeration types used across the application."""

from enum import Enum


class RecipeCategory(str, Enum):
    """Categories for recipes."""

    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
    DESSERT = "dessert"
    BEVERAGE = "beverage"


class IngredientUnit(str, Enum):
    """Units of measurement for ingredients."""

    # Volume
    CUP = "cup"
    TABLESPOON = "tablespoon"
    TEASPOON = "teaspoon"
    MILLILITER = "milliliter"
    LITER = "liter"
    FLUID_OUNCE = "fluid_ounce"

    # Weight
    GRAM = "gram"
    KILOGRAM = "kilogram"
    OUNCE = "ounce"
    POUND = "pound"

    # Count/Other
    PIECE = "piece"
    WHOLE = "whole"
    SLICE = "slice"
    CLOVE = "clove"
    PINCH = "pinch"
    DASH = "dash"
    TO_TASTE = "to_taste"


class MealType(str, Enum):
    """Types of meals in a day."""

    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
