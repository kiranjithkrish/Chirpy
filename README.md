# Chirpy 🐦

A modern, lightweight social media API built with TypeScript, Express.js, and PostgreSQL. Chirpy allows users to create accounts, post short messages (chirps), and interact with a clean REST API.

## What Chirpy Does

Chirpy is a microblogging platform API that provides:

- **User Management**: Create accounts, login with JWT authentication, and manage user profiles
- **Chirp Posts**: Create, read, and delete short text posts (similar to tweets)
- **Authentication**: Secure JWT-based authentication with refresh token support
- **Database Management**: PostgreSQL database with automatic migrations using Drizzle ORM
- **API Metrics**: Built-in monitoring and metrics collection
- **Web Interface**: Simple web frontend served at `/app`

### Key Features

- 🔐 **Secure Authentication**: JWT tokens with refresh token rotation
- 📝 **CRUD Operations**: Full Create, Read, Update, Delete for chirps
- 🗄️ **Database Migrations**: Automatic schema management with Drizzle ORM
- 📊 **Monitoring**: Built-in metrics and health checks
- 🚀 **TypeScript**: Fully typed codebase for better development experience
- 🐘 **PostgreSQL**: Robust relational database backend

## Why You Should Care

### For Developers

- **Learning Resource**: Perfect example of a modern TypeScript/Node.js API with best practices
- **Production Ready**: Includes authentication, database migrations, error handling, and monitoring
- **Well Structured**: Clean architecture with separated concerns (routes, middleware, database layer)
- **Extensible**: Easy to add new features or modify existing functionality

### For Projects

- **Quick Start**: Get a social media API running in minutes
- **Scalable Foundation**: Built with scalability in mind using proven technologies
- **Security First**: Implements proper authentication and authorization patterns
- **Developer Friendly**: Comprehensive API with clear endpoints and error handling

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Chirpy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DB_URL=postgres://username:password@localhost:5432/chirpy?sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-here
PLATFORM=development
POLKA_KEY=your-polka-key-here
```

**Required Environment Variables:**

- `DB_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PLATFORM`: Platform identifier (e.g., "development", "production")
- `POLKA_KEY`: Key for Polka webhook integration

### 4. Set Up Database

1. Create a PostgreSQL database:

```sql
CREATE DATABASE chirpy;
```

2. The application will automatically run migrations on startup, but you can also run them manually:

```bash
npm run build
node dist/index.js
```

### 5. Build and Run

**Development Mode:**

```bash
npm run dev
```

**Production Mode:**

```bash
npm run build
npm start
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /api/users` - Create a new user
- `POST /api/login` - User login
- `POST /api/refresh` - Refresh JWT token
- `POST /api/revoke` - Revoke refresh token
- `PUT /api/users` - Update user profile

### Chirps

- `GET /api/chirps` - Get all chirps
- `GET /api/chirps/:chirpId` - Get specific chirp
- `POST /api/chirps` - Create new chirp
- `DELETE /api/chirps/:chirpId` - Delete chirp

### System

- `GET /api/healthz` - Health check
- `GET /admin/metrics` - Get system metrics
- `POST /admin/reset` - Reset metrics
- `GET /app` - Web interface

## Testing the API

The project includes HTTP test files in the `api-tests/` directory. You can use these with VS Code REST Client or similar tools:

- `createUser.http` - Test user creation
- `validateChirp.http` - Test chirp validation
- `reset.http` - Test metrics reset

### Example API Usage

**Create a User:**

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Create a Chirp:**

```bash
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"body": "Hello, Chirpy!"}'
```

## Project Structure

```
Chirpy/
├── src/
│   ├── api/           # API route handlers
│   ├── app/           # Static web assets
│   ├── db/            # Database schema and migrations
│   ├── middlewares/   # Express middlewares
│   └── index.ts       # Main application entry point
├── api-tests/         # HTTP test files
├── drizzle.config.ts  # Database configuration
└── package.json       # Project dependencies
```

## Development

### Running Tests

```bash
npm test
```

### Database Migrations

The project uses Drizzle ORM for database management. Migrations are automatically applied on startup, but you can also run them manually using the Drizzle CLI.

### Adding New Features

1. Add new routes in `src/api/`
2. Update database schema in `src/db/schema.ts`
3. Create new migrations if needed
4. Add tests for new functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License - see package.json for details.

## Support

For issues and questions, please open an issue on the GitHub repository.
