"""Recipe routes for CRUD operations."""

from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.dependencies import CurrentUser, DbSession
from app.schemas.recipe import (
    CategoryListResponse,
    RecipeCreate,
    RecipeListResponse,
    RecipeResponse,
    RecipeUpdate,
)
from app.services.recipe import RecipeService
from app.utils.enums import RecipeCategory

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get(
    "/categories",
    response_model=CategoryListResponse,
    summary="Get recipe categories",
    description="Get list of available recipe categories.",
)
async def get_categories(
    _: CurrentUser,
) -> CategoryListResponse:
    """Get all available recipe categories."""
    categories = RecipeService.get_categories()
    return CategoryListResponse(categories=categories)


@router.get(
    "",
    response_model=RecipeListResponse,
    summary="List recipes",
    description="Get paginated list of user's recipes with optional filters.",
)
async def list_recipes(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=10, ge=1, le=100, description="Items per page"),
    category: RecipeCategory | None = Query(default=None, description="Filter by category"),
    search: str | None = Query(default=None, max_length=100, description="Search in recipe name"),
) -> RecipeListResponse:
    """
    List all recipes for the authenticated user.

    Supports pagination, category filtering, and search by name.
    """
    recipes, total = await RecipeService.get_recipes(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        category=category,
        search=search,
    )

    pages = (total + page_size - 1) // page_size  # Ceiling division

    return RecipeListResponse(
        items=[RecipeResponse.model_validate(r) for r in recipes],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.post(
    "",
    response_model=RecipeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create recipe",
    description="Create a new recipe with ingredients.",
)
async def create_recipe(
    recipe_data: RecipeCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> RecipeResponse:
    """
    Create a new recipe.

    - **name**: Recipe name
    - **description**: Optional short description
    - **instructions**: Cooking instructions
    - **prep_time_minutes**: Preparation time
    - **cook_time_minutes**: Cooking time
    - **servings**: Number of servings
    - **category**: Recipe category
    - **ingredients**: List of ingredients with name, quantity, unit
    """
    recipe = await RecipeService.create_recipe(
        db=db,
        user_id=current_user.id,
        recipe_data=recipe_data,
    )
    return RecipeResponse.model_validate(recipe)


@router.get(
    "/{recipe_id}",
    response_model=RecipeResponse,
    summary="Get recipe",
    description="Get a single recipe by ID.",
)
async def get_recipe(
    recipe_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> RecipeResponse:
    """Get a single recipe by its ID."""
    recipe = await RecipeService.get_recipe_by_id(
        db=db,
        recipe_id=recipe_id,
        user_id=current_user.id,
    )

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    return RecipeResponse.model_validate(recipe)


@router.put(
    "/{recipe_id}",
    response_model=RecipeResponse,
    summary="Update recipe",
    description="Update an existing recipe.",
)
async def update_recipe(
    recipe_id: UUID,
    recipe_data: RecipeUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RecipeResponse:
    """
    Update an existing recipe.

    All fields are optional - only provided fields will be updated.
    If ingredients are provided, they will replace the existing ingredients.
    """
    recipe = await RecipeService.get_recipe_by_id(
        db=db,
        recipe_id=recipe_id,
        user_id=current_user.id,
    )

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    updated_recipe = await RecipeService.update_recipe(
        db=db,
        recipe=recipe,
        recipe_data=recipe_data,
    )

    return RecipeResponse.model_validate(updated_recipe)


@router.delete(
    "/{recipe_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete recipe",
    description="Delete a recipe and all its ingredients.",
)
async def delete_recipe(
    recipe_id: UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """Delete a recipe by its ID."""
    recipe = await RecipeService.get_recipe_by_id(
        db=db,
        recipe_id=recipe_id,
        user_id=current_user.id,
    )

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    await RecipeService.delete_recipe(db=db, recipe=recipe)
