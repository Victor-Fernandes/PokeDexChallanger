# Pokédex Challenger

A full-stack Pokémon management application built with NestJS and React in an NX monorepo architecture. This application allows users to browse, search, create, update, and delete Pokémon entries with data sourced from the PokeAPI.

## Project Overview

This project is structured as a monorepo using NX, containing both backend and frontend applications:

- **Backend**: NestJS application with a hexagonal architecture
- **Frontend**: React application with TypeScript and modern component structure

## Technologies Used

### Backend

- NestJS
- TypeORM
- SQLite
- Class Validator & Class Transformer
- Swagger for API documentation
- Google Gemini API for Pokémon descriptions
- Cache Manager for performance optimization

### Frontend

- React
- TypeScript
- CSS Modules
- Fetch API for backend communication

## Project Structure

```
PokedexChallenger/
├── backend/                  # NestJS backend application
│   ├── data/                 # SQLite database files
│   ├── src/
│   │   ├── application/      # Application layer (DTOs, services, use cases)
│   │   ├── domain/           # Domain layer (entities, interfaces)
│   │   └── infrastructure/   # Infrastructure layer (controllers, repositories, adapters)
│   ├── ormconfig.js          # TypeORM configuration
│   └── env.example           # Environment variables example
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # React components
│   │   │   ├── interfaces/   # TypeScript interfaces
│   │   │   └── services/     # API services
│   │   └── assets/           # Static assets
└── package.json              # Root package.json with scripts for the monorepo
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/PokedexChallenger.git
   cd PokedexChallenger
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory based on the `env.example` file

   ```bash
   cd backend
   cp env.example .env
   ```

### Database Setup

The application uses SQLite as the database. To set up the database:

1. Run migrations to create the database schema

   ```bash
   npm run migration:run
   ```

If you need to generate new migrations after making changes to entities:

```bash
npm run migration:generate
```

To revert the last migration:

```bash
npm run migration:revert
```

### Running the Application

#### Backend

To start the backend in development mode:

```bash
npm run start:pokedex:dev
```

For debugging:

```bash
npm run start:pokedex:debug
```

The backend API will be available at: <http://localhost:3000>

API documentation (Swagger) will be available at: <http://localhost:3000/api>

#### Frontend

To start the frontend development server:

```bash
npm run start:frontend
```

To build the frontend for production:

```bash
npm run build:frontend
```

The frontend application will be available at: <http://localhost:4200>

## API Endpoints

The backend provides the following RESTful endpoints:

- `GET /pokedex` - List all Pokémon with pagination and filtering
  - Query parameters:
    - `page` (default: 1)
    - `itemsPerPage` (default: 5)
    - `name` (optional)
    - `type` (optional)
- `GET /pokedex/:id` - Get a specific Pokémon by ID
- `POST /pokedex` - Create a new Pokémon
- `PATCH /pokedex/:id` - Update an existing Pokémon
- `DELETE /pokedex/:id` - Delete a Pokémon

## Features

- **Pokémon Listing**: Browse all Pokémon with pagination
- **Filtering**: Filter Pokémon by name and type
- **Detailed View**: View detailed information about each Pokémon
- **CRUD Operations**: Create, read, update, and delete Pokémon
- **Responsive Design**: Mobile-friendly interface
- **Integration with PokeAPI**: Fetch Pokémon data from the official PokeAPI
- **AI-Generated Descriptions**: Pokémon descriptions generated using Google's Gemini API

## Architecture

### Backend

The backend follows a hexagonal architecture with three main layers:

1. **Domain Layer**: Contains the core business logic, entities, and interfaces
2. **Application Layer**: Implements use cases and services that orchestrate the domain
3. **Infrastructure Layer**: Provides implementations for interfaces defined in the domain layer

### Frontend

The frontend follows a component-based architecture with:

1. **Components**: Reusable UI components
2. **Services**: Handle API communication
3. **Interfaces**: TypeScript interfaces for type safety

## Development Notes

- The application uses NX for monorepo management, allowing for shared code and efficient builds
- TypeORM is used for database operations with a repository pattern
- The frontend uses React with functional components and hooks
- API documentation is available through Swagger

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
