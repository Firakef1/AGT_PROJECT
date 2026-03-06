# GubaeTech Backend API

This is the backend for the **GubaeTech** application, built using Node.js, Express, TypeScript, and Prisma with a PostgreSQL database. 

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Running Locally](#running-locally)
4. [Running with Docker](#running-with-docker)
5. [API Documentation (Swagger UI)](#api-documentation-swagger-ui)
6. [API Endpoints](#api-endpoints)

---

## Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v16+
- **Docker** and **Docker Compose** (for containerized deployment)

---

## Project Setup

1. **Clone the repository** and navigate to the `BackEnd` directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Copy the example environment file and fill in the necessary variables:
   ```bash
   cp .env.example .env
   ```
   (Ensure `DATABASE_URL` matches your local or Docker connection string)

---

## Running Locally

To run the server locally during development:

1. **Start your local PostgreSQL database**.
2. **Push the database schema** (if needed):
   ```bash
   npx prisma db push
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
    The server will typically start on `http://localhost:4000` (check your `.env` `PORT`).

**Build for Production**:
```bash
npm run build
npm start
```

---

## Running with Docker

The easiest way to run the entire backend stack (application + database) is using Docker Compose.

1. **Build and start the containers**:
   ```bash
   docker-compose up --build -d
   ```
2. The API will be accessible at `http://localhost:4000`. The PostgreSQL database will run on port `5432`.
3. To stop the containers:
   ```bash
   docker-compose down
   ```

---

## API Documentation (Swagger UI)

This project uses **Swagger UI** for complete and interactive API documentation. You can test endpoints directly from the interface.

Once the server is running, open your browser and navigate to:
**[http://localhost:4000/docs](http://localhost:4000/docs)**

---

## API Endpoints

Below is a brief outline of the provided endpoints. For full request/response schemas, please check the **Swagger UI**.

### Authentication (`/auth`)
- `POST /auth/register` : Register a new user (Admin access required).
- `POST /auth/login` : Login user and receive a JWT.
- `GET /auth/google` : Redirect to Google OAuth.
- `GET /auth/google/callback` : Google OAuth callback handler.

### Divisions (`/divisions`)
- `GET /divisions/` : List all divisions.
- `POST /divisions/` : Create a new division.
- `PUT /divisions/:id` : Update a division.
- `DELETE /divisions/:id` : Delete a division.

### Members (`/members`)
- `GET /members/` : List all members. (Admin/Division Head access)
- `POST /members/` : Add a new member. (Admin/Division Head access)
- `PUT /members/:id` : Update member details. (Admin/Division Head access)
- `DELETE /members/:id` : Delete a member. (Admin access only)

### Events (`/events`)
- `GET /events/` : List all events.
- `POST /events/` : Create an event. (Admin/Division Head access)
- `PUT /events/:id` : Update an event. (Admin/Division Head access)
- `DELETE /events/:id` : Delete an event. (Admin access only)

### Attendance (`/attendance`)
- `POST /attendance/` : Mark attendance for a member.
- `GET /attendance/event/:eventId` : Get all attendance records for a specific event.
- `GET /attendance/member/:memberId/summary` : Get attendance summary for a particular member.

### Finance (`/finance`)
- `POST /finance/` : Record a new financial transaction.
- `GET /finance/summary` : Get an overview/summary of finances.

### Inventory (`/inventory`)
- `GET /inventory/` : List all inventory items.
- `POST /inventory/` : Add a new inventory item.
- `PUT /inventory/:id` : Update an inventory item.
- `DELETE /inventory/:id` : Delete an inventory item.

### Dashboard (`/dashboard`)
- `GET /dashboard/summary` : Get the system dashboard summary data.
