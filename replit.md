# Overview

CFO.ai is an AI-powered financial intelligence platform designed for startup founders and finance teams. The application provides comprehensive financial planning, tax optimization, cash flow forecasting, and AI-driven insights to help companies make data-driven financial decisions. Built as a full-stack web application, it integrates with external financial services and provides real-time analytics through a modern dashboard interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 using TypeScript and follows a component-based architecture. Key design decisions include:

- **UI Framework**: Utilizes shadcn/ui components built on Radix UI primitives for accessibility and consistent design
- **Styling**: Tailwind CSS with custom Google Cloud-inspired color scheme and CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing with file-based page organization
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Charts**: Recharts library for financial data visualization including cash flow, revenue, and profitability charts
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
The backend follows a REST API design using Express.js with TypeScript:

- **Server Framework**: Express.js with middleware for logging, error handling, and CORS
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Pattern**: Interface-based storage layer with in-memory implementation for development
- **API Structure**: Resource-based endpoints (`/api/dashboard`, `/api/cash-flow`, `/api/tax-planning`) with consistent response formats

## Data Storage Solutions
The application uses a hybrid approach for data persistence:

- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle with TypeScript schema definitions for type safety
- **Migration Management**: Drizzle Kit for database schema migrations
- **Development Storage**: In-memory storage implementation for rapid development and testing
- **Schema Design**: Normalized tables for users, financial data, tax optimization, forecasts, news articles, and AI insights

## Authentication and Authorization
Currently implements a simplified demo approach:

- **Demo Mode**: Uses a hardcoded demo user ID for simplified demonstration
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Future Extensibility**: Architecture supports full user authentication system implementation

## External Service Integrations

### Financial Data Integration
- **Payabl**: Financial data import and synchronization
- **Banking APIs**: Ready for integration with open banking standards

### AI Services
- **OpenAI Integration**: GPT-4o model for generating financial insights, news summarization, and tax optimization recommendations
- **AI Features**: Automated insight generation, relevance scoring for news articles, and financial forecasting

### Platform Integrations
- **Google Cloud Platform**: Hosting and AI services integration
- **ipushpull**: Data optimization and real-time financial data streaming

### News and Market Data
- **Industry News**: Integration ready for Bloomberg API, Financial Times API, and BBC Business API
- **Mock Data**: Current implementation uses structured mock data for demonstration

## Development and Build Tools
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Development**: Hot module replacement and error overlay for enhanced developer experience
- **Deployment**: ESBuild for server bundling with Node.js ESM format