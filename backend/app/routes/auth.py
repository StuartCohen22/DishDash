"""Authentication routes for user registration, login, and profile."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies import CurrentUser, DbSession
from app.schemas.user import Token, UserCreate, UserResponse
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with email, password, and name.",
)
async def register(
    user_data: UserCreate,
    db: DbSession,
) -> UserResponse:
    """
    Register a new user.

    - **email**: Must be a valid email address and unique
    - **password**: Must be at least 8 characters
    - **name**: User's display name
    """
    # Check if email already exists
    existing_user = await AuthService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    user = await AuthService.create_user(
        db=db,
        email=user_data.email,
        password=user_data.password,
        name=user_data.name,
    )

    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=Token,
    summary="Login and get access token",
    description="Authenticate with email and password to receive a JWT token.",
)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DbSession,
) -> Token:
    """
    Login with email and password.

    Returns a JWT access token that must be included in the Authorization header
    for protected endpoints: `Authorization: Bearer <token>`

    Note: Uses OAuth2 form format where 'username' field contains the email.
    """
    # Authenticate user (OAuth2 form uses 'username' field for email)
    user = await AuthService.authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token with user ID in 'sub' claim
    access_token = AuthService.create_access_token(
        data={"sub": str(user.id)}
    )

    return Token(access_token=access_token)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get the profile of the currently authenticated user.",
)
async def get_current_user_profile(
    current_user: CurrentUser,
) -> UserResponse:
    """
    Get the current authenticated user's profile.

    Requires a valid JWT token in the Authorization header.
    """
    return UserResponse.model_validate(current_user)
