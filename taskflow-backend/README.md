# TaskFlow Microservices

This project is a Spring Boot microservices implementation of the TaskFlow task management system.

## Architecture

The application has been split into two microservices:

1. **User Service**: Handles all user-related functionality
   - User management (CRUD operations)
   - Authentication and authorization
   - Employee management
   
2. **Task Service**: Handles all task-related functionality
   - Task creation and management
   - Task assignment
   - Task status tracking

## Technology Stack

- Java 21
- Spring Boot 3.2.3
- Spring Data JPA
- Spring Security
- MySQL Database
- OpenFeign Client (for inter-service communication)
- JWT Authentication

## Service Communication

The Task Service communicates with the User Service using OpenFeign client to:
- Validate user existence when assigning tasks
- Retrieve user information when needed

## Ports

- User Service: 8081
- Task Service: 8082

## API Endpoints

### User Service

- `/api/users/{username}` - Get user by username
- `/api/users/id/{id}` - Get user by ID
- `/api/users/employees` - Get all employees (with filtering options)
- `/api/auth/register` - Register a new user
- `/api/auth/login` - Authenticate a user

### Task Service

- `/api/tasks` - Get all tasks / Create a new task
- `/api/tasks/{id}` - Get, update, or delete a specific task
- `/api/tasks/assigned` - Get tasks assigned to the current user
- `/api/tasks/created` - Get tasks created by the current user
- `/api/tasks/filter` - Filter tasks by status or assignee

## Running the Services

1. Start the User Service first:

```bash
cd user-service
mvn spring-boot:run
```

2. Then start the Task Service:

```bash
cd task-service
mvn spring-boot:run
```

## Future Improvements

- Add Eureka Service Discovery
- Implement Spring Cloud Gateway
- Add Circuit Breaker pattern with Resilience4j
- Implement distributed tracing 