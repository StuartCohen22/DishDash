# DishDash - Recipe & Meal Planning Application

A full-stack web application for managing recipes, planning weekly meals, and generating shopping lists. Built as a university group project with deployment on Google Cloud Platform.

## Features

- **Recipe Management**: Create, edit, and organize recipes with ingredients and instructions
- **Meal Planning**: Plan your meals for the week with a visual calendar
- **Shopping Lists**: Auto-generate shopping lists from meal plans with quantity aggregation
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **Database**: PostgreSQL 15 with async support
- **ORM**: SQLAlchemy 2.0 (async)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Auth**: JWT (python-jose) + bcrypt (passlib)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS

### Infrastructure
- **Containerization**: Docker + docker-compose
- **Cloud**: GCP Cloud Run + Cloud SQL
- **CI/CD**: Cloud Build

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/StuartCohen22/DishDash.git
   cd DishDash
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Run database migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

5. **Seed demo data (optional)**
   ```bash
   docker-compose exec backend python -m scripts.seed_data
   ```

### Development Without Docker

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start dev server
npm run dev
```

## Project Structure

```
DishDash/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── config.py       # Settings management
│   │   ├── database.py     # Database configuration
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Business logic
│   ├── alembic/            # Database migrations
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React context
│   │   └── types/          # TypeScript types
│   └── public/
├── deployment/             # Deployment configs
├── docker-compose.yml      # Local dev setup
└── README.md
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login and get JWT |
| GET | /api/v1/auth/me | Get current user |
| GET | /api/v1/recipes | List recipes |
| POST | /api/v1/recipes | Create recipe |
| GET | /api/v1/recipes/{id} | Get recipe |
| PUT | /api/v1/recipes/{id} | Update recipe |
| DELETE | /api/v1/recipes/{id} | Delete recipe |

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | (required) |
| JWT_SECRET_KEY | Secret for JWT signing | (required in prod) |
| JWT_ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration | 1440 |
| ENVIRONMENT | dev/staging/production | development |
| CORS_ORIGINS | Allowed origins | localhost:5173 |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:8000 |

## Team Members

| Role | Responsibilities |
|------|------------------|
| Backend Lead | FastAPI, database, API design |
| Database Dev | Models, migrations, queries |
| Auth Dev | Authentication, security |
| Frontend Lead | React setup, routing, state |
| UI Dev | Components, styling, UX |
| DevOps | Docker, CI/CD, deployment |
| QA/Docs | Testing, documentation |

## Development Workflow

1. Create a feature branch from `main`
2. Make changes and test locally
3. Create a pull request
4. Get code review approval
5. Merge to `main`

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed GCP deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes as part of a university course.

## Acknowledgments

- FastAPI documentation
- React documentation
- Tailwind CSS
- Google Cloud Platform
