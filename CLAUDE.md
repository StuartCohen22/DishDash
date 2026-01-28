# CLAUDE.md - DishDash Codebase Guide

This document provides a comprehensive overview of the DishDash codebase for AI assistants and developers.

## Project Overview

DishDash is a Recipe/Meal Planner web application built for a university group project. It allows users to:
- Create and manage recipes with ingredients
- Plan weekly meals using a calendar interface
- Auto-generate shopping lists from meal plans

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Database**: PostgreSQL 15 with asyncpg driver
- **ORM**: SQLAlchemy 2.0 with async support
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Authentication**: JWT tokens (python-jose) + bcrypt password hashing (passlib)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS

### Infrastructure
- **Containerization**: Docker + docker-compose
- **Cloud**: GCP Cloud Run + Cloud SQL
- **CI/CD**: Cloud Build

## Project Structure

```
DishDash/
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app entry point, routers, middleware
│   │   ├── config.py          # Pydantic settings from environment
│   │   ├── database.py        # Async SQLAlchemy engine and session
│   │   ├── dependencies.py    # FastAPI dependencies (get_current_user, etc.)
│   │   ├── models/            # SQLAlchemy ORM models
│   │   │   ├── base.py        # Declarative base with naming conventions
│   │   │   ├── user.py        # User model
│   │   │   ├── recipe.py      # Recipe + Ingredient models
│   │   │   ├── meal_plan.py   # MealPlan + PlannedMeal models
│   │   │   └── shopping.py    # ShoppingList + ShoppingItem models
│   │   ├── schemas/           # Pydantic v2 request/response schemas
│   │   │   ├── user.py
│   │   │   ├── recipe.py
│   │   │   ├── meal_plan.py
│   │   │   └── shopping.py
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.py        # /api/v1/auth/* endpoints
│   │   │   ├── recipes.py     # /api/v1/recipes/* endpoints
│   │   │   ├── meal_plans.py  # /api/v1/meal-plans/* endpoints
│   │   │   └── shopping.py    # /api/v1/shopping-lists/* endpoints
│   │   ├── services/          # Business logic layer
│   │   │   ├── auth.py        # JWT creation, password hashing
│   │   │   ├── recipe.py      # Recipe CRUD operations
│   │   │   ├── meal_plan.py   # Meal plan operations
│   │   │   └── shopping.py    # Shopping list generation
│   │   └── utils/
│   │       ├── enums.py       # RecipeCategory, IngredientUnit, MealType
│   │       └── logging.py     # Structured JSON logging
│   ├── alembic/               # Database migrations
│   │   ├── versions/          # Migration files
│   │   └── env.py             # Async Alembic configuration
│   ├── scripts/
│   │   └── seed_data.py       # Demo data seeding script
│   ├── tests/                 # Pytest tests
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Multi-stage build (dev/prod)
│   └── .env.example           # Environment template
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── main.tsx           # React entry point
│   │   ├── App.tsx            # Root component with router
│   │   ├── components/
│   │   │   ├── common/        # Reusable UI components
│   │   │   ├── layout/        # Header, Sidebar, MainLayout
│   │   │   ├── auth/          # LoginForm, RegisterForm, ProtectedRoute
│   │   │   ├── recipes/       # Recipe-related components
│   │   │   ├── meal-plans/    # Meal planning components
│   │   │   └── shopping/      # Shopping list components
│   │   ├── pages/             # Route page components
│   │   ├── services/          # API service functions
│   │   │   ├── api.ts         # Axios instance with interceptors
│   │   │   ├── auth.service.ts
│   │   │   ├── recipe.service.ts
│   │   │   ├── mealPlan.service.ts
│   │   │   └── shopping.service.ts
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── deployment/                 # Deployment configurations
│   ├── cloudbuild.yaml        # GCP Cloud Build config
│   ├── k8s/                   # Kubernetes manifests (optional)
│   └── terraform/             # Infrastructure as Code (optional)
│
├── docker-compose.yml         # Local development setup
├── .gitignore
├── README.md                  # Project overview and setup
├── ARCHITECTURE.md            # System architecture docs
├── DEPLOYMENT.md              # GCP deployment guide
└── CLAUDE.md                  # This file
```

## Database Schema

### Tables and Relationships

```
users
├── id (UUID PK)
├── email (unique, indexed)
├── password_hash
├── name
├── created_at
└── updated_at
    │
    ├──< recipes (one-to-many)
    │   ├── id (UUID PK)
    │   ├── user_id (FK -> users)
    │   ├── name
    │   ├── description
    │   ├── instructions (text)
    │   ├── prep_time_minutes
    │   ├── cook_time_minutes
    │   ├── servings
    │   ├── category (enum)
    │   ├── created_at
    │   └── updated_at
    │       │
    │       └──< ingredients (one-to-many, cascade delete)
    │           ├── id (UUID PK)
    │           ├── recipe_id (FK -> recipes)
    │           ├── name
    │           ├── quantity (decimal)
    │           ├── unit (enum)
    │           └── order_index
    │
    └──< meal_plans (one-to-many)
        ├── id (UUID PK)
        ├── user_id (FK -> users)
        ├── name
        ├── week_start_date
        ├── created_at
        └── updated_at
            │
            ├──< planned_meals (one-to-many)
            │   ├── id (UUID PK)
            │   ├── meal_plan_id (FK -> meal_plans)
            │   ├── recipe_id (FK -> recipes)
            │   ├── day_of_week (0-6)
            │   ├── meal_type (enum)
            │   └── created_at
            │
            └──< shopping_lists (one-to-one)
                ├── id (UUID PK)
                ├── meal_plan_id (FK -> meal_plans)
                ├── generated_at
                └── updated_at
                    │
                    └──< shopping_items (one-to-many)
                        ├── id (UUID PK)
                        ├── shopping_list_id (FK -> shopping_lists)
                        ├── ingredient_name
                        ├── quantity (decimal)
                        ├── unit
                        ├── is_purchased (boolean)
                        └── created_at
```

### Enums

- **RecipeCategory**: breakfast, lunch, dinner, snack, dessert, beverage
- **IngredientUnit**: cup, tablespoon, teaspoon, gram, ounce, pound, milliliter, liter, piece, whole, pinch, to_taste
- **MealType**: breakfast, lunch, dinner, snack

## API Endpoints

All endpoints under `/api/v1/` unless noted otherwise.

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login, get JWT token | No |
| GET | /auth/me | Get current user info | Yes |

### Recipes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /recipes | Create recipe with ingredients | Yes |
| GET | /recipes | List user's recipes (paginated) | Yes |
| GET | /recipes/{id} | Get single recipe | Yes |
| PUT | /recipes/{id} | Update recipe | Yes |
| DELETE | /recipes/{id} | Delete recipe | Yes |
| GET | /recipes/categories | Get available categories | Yes |

### Meal Plans
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /meal-plans | Create meal plan | Yes |
| GET | /meal-plans | List user's meal plans | Yes |
| GET | /meal-plans/{id} | Get meal plan with meals | Yes |
| PUT | /meal-plans/{id} | Update meal plan | Yes |
| DELETE | /meal-plans/{id} | Delete meal plan | Yes |
| POST | /meal-plans/{id}/meals | Add recipe to plan | Yes |
| GET | /meal-plans/{id}/meals | Get meals in plan | Yes |
| DELETE | /planned-meals/{id} | Remove meal from plan | Yes |

### Shopping Lists
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /meal-plans/{id}/shopping-list | Generate shopping list | Yes |
| GET | /shopping-lists/{id} | Get shopping list | Yes |
| PATCH | /shopping-items/{id} | Toggle is_purchased | Yes |
| DELETE | /shopping-items/{id} | Remove item | Yes |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |

## Development Commands

### Local Development
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up backend
docker-compose up frontend

# Run database migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Seed demo data
docker-compose exec backend python -m scripts.seed_data

# View logs
docker-compose logs -f backend
```

### Backend Commands (without Docker)
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest
```

### Frontend Commands (without Docker)
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npm run typecheck
```

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | (required) |
| JWT_SECRET_KEY | Secret for JWT signing | (required in prod) |
| JWT_ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration | 1440 (24h) |
| ENVIRONMENT | dev/staging/production | development |
| DEBUG | Enable debug mode | true |
| CORS_ORIGINS | Allowed origins (comma-sep) | localhost:5173 |
| LOG_LEVEL | Logging level | INFO |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:8000 |

## Key Code Patterns

### Async Database Session
```python
# In routes, use dependency injection:
from app.database import get_db

@router.get("/items")
async def get_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Item))
    return result.scalars().all()
```

### JWT Authentication
```python
# Protected route:
from app.dependencies import get_current_user

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

### Pydantic Schemas (v2)
```python
from pydantic import BaseModel, ConfigDict

class RecipeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    # ...
```

### Frontend API Calls
```typescript
// services/recipe.service.ts
import api from './api';

export const recipeService = {
  getAll: () => api.get<Recipe[]>('/recipes'),
  getById: (id: string) => api.get<Recipe>(`/recipes/${id}`),
  create: (data: CreateRecipeInput) => api.post<Recipe>('/recipes', data),
  // ...
};
```

## Testing

### Backend Tests
- Located in `backend/tests/`
- Use pytest with pytest-asyncio
- Test database uses SQLite in-memory
- Run: `pytest` or `docker-compose exec backend pytest`

### Frontend Tests
- Located alongside components as `*.test.tsx`
- Use Vitest + React Testing Library
- Run: `npm test`

## Deployment

1. **Cloud SQL**: PostgreSQL instance
2. **Cloud Run**: Backend container
3. **Cloud Run/Firebase Hosting**: Frontend static files
4. **Secret Manager**: JWT_SECRET_KEY
5. **Cloud Build**: CI/CD pipeline

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Common Tasks

### Adding a New API Endpoint
1. Create/update model in `backend/app/models/`
2. Create migration: `alembic revision --autogenerate -m "description"`
3. Create schema in `backend/app/schemas/`
4. Add service method in `backend/app/services/`
5. Add route in `backend/app/routes/`
6. Register router in `main.py` if new file

### Adding a New Frontend Page
1. Create types in `frontend/src/types/`
2. Add service methods in `frontend/src/services/`
3. Create components in `frontend/src/components/`
4. Create page in `frontend/src/pages/`
5. Add route in `App.tsx`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL format: `postgresql+asyncpg://user:pass@host:port/db`
- For Cloud SQL, use Unix socket: `?host=/cloudsql/project:region:instance`

### CORS Errors
- Add frontend origin to CORS_ORIGINS in backend env
- In development, ensure localhost:5173 is allowed

### JWT Token Issues
- Check token expiration (default 24h)
- Ensure JWT_SECRET_KEY matches between requests
- Frontend should include `Authorization: Bearer <token>` header

### Migration Conflicts
- Always create migrations from a clean state
- Don't edit migration files after they're applied
- Use `alembic history` to check migration chain
