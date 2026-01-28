# DishDash Architecture

This document describes the architecture and technical design decisions for the DishDash application.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            React + TypeScript + Vite                     │    │
│  │   - React Router for navigation                          │    │
│  │   - Axios for HTTP requests with JWT interceptors        │    │
│  │   - React Hook Form + Zod for form validation            │    │
│  │   - Tailwind CSS for styling                             │    │
│  │   - Context API for state management (Auth)              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              │ JSON + JWT Bearer Token
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API Layer                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           FastAPI (Async Python 3.12+)                   │    │
│  │   - Automatic OpenAPI documentation                      │    │
│  │   - Pydantic v2 for request/response validation          │    │
│  │   - OAuth2 + JWT authentication                          │    │
│  │   - CORS middleware                                      │    │
│  │   - Dependency injection for DB sessions                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ asyncpg (async PostgreSQL driver)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL 15 Database                      │    │
│  │   - SQLAlchemy 2.0 ORM with async support                │    │
│  │   - Alembic for schema migrations                        │    │
│  │   - UUID primary keys                                    │    │
│  │   - Referential integrity with foreign keys              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌──────────────────┐
│      users       │
├──────────────────┤
│ id (UUID PK)     │
│ email (unique)   │
│ password_hash    │
│ name             │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐         ┌──────────────────┐
│     recipes      │         │    meal_plans    │
├──────────────────┤         ├──────────────────┤
│ id (UUID PK)     │         │ id (UUID PK)     │
│ user_id (FK)     │◄────────│ user_id (FK)     │
│ name             │         │ name             │
│ description      │         │ week_start_date  │
│ instructions     │         │ created_at       │
│ prep_time_min    │         │ updated_at       │
│ cook_time_min    │         └────────┬─────────┘
│ servings         │                  │
│ category (enum)  │                  │ 1:N
│ created_at       │                  ▼
│ updated_at       │         ┌──────────────────┐
└────────┬─────────┘         │  planned_meals   │
         │                   ├──────────────────┤
         │ 1:N               │ id (UUID PK)     │
         ▼                   │ meal_plan_id (FK)│
┌──────────────────┐         │ recipe_id (FK)   │◄───┐
│   ingredients    │         │ day_of_week      │    │
├──────────────────┤         │ meal_type (enum) │    │
│ id (UUID PK)     │         │ created_at       │    │
│ recipe_id (FK)   │         └────────┬─────────┘    │
│ name             │                  │              │
│ quantity         │         ┌────────┴────────┐     │
│ unit (enum)      │         │  1:1            │     │
│ order_index      │         ▼                 │     │
└──────────────────┘ ┌──────────────────┐      │     │
                     │  shopping_lists  │      │     │
                     ├──────────────────┤      │     │
                     │ id (UUID PK)     │      │     │
                     │ meal_plan_id (FK)│◄─────┘     │
                     │ generated_at     │            │
                     │ updated_at       │            │
                     └────────┬─────────┘            │
                              │                      │
                              │ 1:N                  │
                              ▼                      │
                     ┌──────────────────┐            │
                     │  shopping_items  │            │
                     ├──────────────────┤            │
                     │ id (UUID PK)     │            │
                     │ shopping_list_id │            │
                     │ ingredient_name  │────────────┘
                     │ quantity         │
                     │ unit             │
                     │ is_purchased     │
                     │ created_at       │
                     └──────────────────┘
```

## API Design

### RESTful Endpoints

| Resource | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| Auth | POST | /api/v1/auth/register | Register new user |
| Auth | POST | /api/v1/auth/login | Login, get JWT |
| Auth | GET | /api/v1/auth/me | Get current user |
| Recipes | GET | /api/v1/recipes | List user's recipes |
| Recipes | POST | /api/v1/recipes | Create recipe |
| Recipes | GET | /api/v1/recipes/{id} | Get recipe |
| Recipes | PUT | /api/v1/recipes/{id} | Update recipe |
| Recipes | DELETE | /api/v1/recipes/{id} | Delete recipe |
| Meal Plans | GET | /api/v1/meal-plans | List meal plans |
| Meal Plans | POST | /api/v1/meal-plans | Create meal plan |
| Shopping | POST | /api/v1/meal-plans/{id}/shopping-list | Generate list |

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "id": "uuid",
  "name": "Recipe Name",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Error Response:**
```json
{
  "detail": "Error message here"
}
```

**Paginated Response:**
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "page_size": 10,
  "pages": 10
}
```

## Authentication Flow

```
┌─────────┐          ┌─────────┐          ┌─────────┐
│ Client  │          │   API   │          │   DB    │
└────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │
     │  POST /auth/login  │                    │
     │  (email, password) │                    │
     │───────────────────>│                    │
     │                    │  SELECT user       │
     │                    │───────────────────>│
     │                    │                    │
     │                    │  User record       │
     │                    │<───────────────────│
     │                    │                    │
     │                    │ Verify password    │
     │                    │ (bcrypt)           │
     │                    │                    │
     │                    │ Create JWT         │
     │                    │ (user_id in sub)   │
     │                    │                    │
     │  { access_token }  │                    │
     │<───────────────────│                    │
     │                    │                    │
     │  GET /recipes      │                    │
     │  Authorization:    │                    │
     │  Bearer <token>    │                    │
     │───────────────────>│                    │
     │                    │                    │
     │                    │ Decode JWT         │
     │                    │ Extract user_id    │
     │                    │                    │
     │                    │ SELECT recipes     │
     │                    │ WHERE user_id = ?  │
     │                    │───────────────────>│
     │                    │                    │
     │  { recipes: [...]} │  Recipe records    │
     │<───────────────────│<───────────────────│
     │                    │                    │
```

## Technology Choices

### Backend: FastAPI (Python)

**Why FastAPI?**
- Automatic OpenAPI documentation
- Native async/await support
- Pydantic integration for validation
- High performance (Starlette + Uvicorn)
- Excellent developer experience

**Alternatives Considered:**
- Django REST Framework: More batteries-included but heavier
- Flask: Simpler but less structured, no async
- Express.js: Team more familiar with Python

### Database: PostgreSQL

**Why PostgreSQL?**
- Robust, production-ready RDBMS
- Excellent support for UUID primary keys
- Native ENUM types
- Cloud SQL support on GCP
- Strong data integrity guarantees

**Alternatives Considered:**
- MySQL: Less feature-rich, UUID support weaker
- MongoDB: Relational data model fits better
- SQLite: Not suitable for production multi-user

### ORM: SQLAlchemy 2.0

**Why SQLAlchemy 2.0?**
- Industry standard Python ORM
- Full async support in 2.0
- Declarative mapping for cleaner models
- Alembic integration for migrations
- Excellent documentation

### Frontend: React + TypeScript + Vite

**Why React?**
- Industry standard, large ecosystem
- Component-based architecture
- Hooks for state management
- Team familiarity

**Why TypeScript?**
- Type safety catches errors early
- Better IDE support
- Self-documenting code
- Industry best practice

**Why Vite?**
- Fast development server with HMR
- Optimized production builds
- Native TypeScript support
- Modern tooling

### Styling: Tailwind CSS

**Why Tailwind?**
- Utility-first approach speeds development
- Consistent design system
- Excellent responsive design support
- No context switching between files
- Tree-shaking removes unused CSS

## Security Considerations

### Authentication
- JWT tokens with 24-hour expiration
- Passwords hashed with bcrypt (12 rounds)
- Tokens stored in localStorage (httpOnly cookies for production recommended)
- OAuth2 password flow

### Data Protection
- All API endpoints require authentication (except register/login)
- Users can only access their own data (enforced in queries)
- SQL injection prevented via SQLAlchemy ORM
- Input validation via Pydantic schemas

### CORS
- Configured to allow only specific origins
- Credentials supported for cookie-based auth
- Preflight requests handled

### Production Recommendations
- Use HTTPS everywhere
- Store JWT secret in Secret Manager
- Enable Cloud SQL SSL connections
- Use Cloud IAP for additional protection
- Rate limiting on auth endpoints

## Scalability

### Horizontal Scaling
- Stateless API servers can be replicated
- Database is the single source of truth
- Cloud Run auto-scales based on traffic

### Database Optimization
- Indexes on frequently queried columns (email, user_id)
- Connection pooling configured
- Async queries prevent blocking

### Caching (Future)
- Redis for session storage
- API response caching
- Static asset CDN

## Monitoring & Observability

### Logging
- Structured JSON logs to stdout
- Request/response logging middleware
- Error tracking with stack traces

### GCP Integration
- Cloud Logging for log aggregation
- Cloud Monitoring for metrics
- Error Reporting for exceptions
- Cloud Trace for request tracing (optional)

## Development Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Feature   │     │    Code     │     │    Pull     │
│   Branch    │────>│   Review    │────>│   Request   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                                ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Deploy    │     │    CI/CD    │     │   Merge     │
│   to Prod   │<────│   Pipeline  │<────│   to Main   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch (optional)
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Production hotfixes

### CI/CD Pipeline
1. Push to branch triggers Cloud Build
2. Run linting and type checks
3. Run tests
4. Build Docker images
5. Push to Container Registry
6. Deploy to Cloud Run (on main merge)
