# TaskFlow Task Management System

A comprehensive task management system built with Spring Boot microservices backend and a responsive HTML/CSS/JavaScript frontend.

## Features

- User Authentication and Authorization
- Task Management
- Employee Management
- Calendar Integration
- Dashboard for both Employees and Managers
- Profile Management
- Task Assignment and Tracking

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Java Spring Boot
- Database: MySQL
- Build Tool: Maven

## Project Structure

- `/taskflow-backend/` - Backend microservices:
  - `/user-service/` - Handles user authentication and user management
  - `/task-service/` - Handles task creation, assignment and management
- Frontend files in root directory:
  - HTML files
  - `/js/` - JavaScript files
  - `/css/` - CSS styles
  - `/images/` - Image assets

## Backend Microservices

The backend is split into two separate microservices:

1. **User Service** (Port 8081): Handles user management, authentication, and authorization
2. **Task Service** (Port 8082): Handles task creation, assignment, and tracking

Each service has its own:
- Database connections (to the same shared database)
- REST API endpoints
- Business logic
- Configuration

## Frontend

The frontend is a responsive web application built with:
- HTML5
- CSS3 with Bootstrap 5
- JavaScript (vanilla)

Key features:
- Manager and employee dashboards
- Task creation and management
- Task assignment to employees
- User profiles and management
- Authentication with JWT

## How to Run the Application

### Backend

Start both microservices:

```bash
# Start the User Service
cd taskflow-backend/user-service
mvn spring-boot:run

# In a separate terminal, start the Task Service
cd taskflow-backend/task-service
mvn spring-boot:run
```

### Frontend

Simply open any of the HTML files in your browser, or serve them using a local web server:

```bash
# Using Python's built-in HTTP server
python -m http.server 8000

# Or with Node.js http-server (install with: npm install -g http-server)
http-server
```

Then open your browser to http://localhost:8000 (or whatever port your server is using).

## Connecting Frontend with Microservices

The frontend connects to the backend microservices through REST API calls. The connection configuration is defined in the `js/config.js` file.

Key points:
- User Service runs on port 8081
- Task Service runs on port 8082
- API paths are defined in the config file
- JWT tokens are used for authentication

Login credentials (for development):
- Manager: admin@example.com / password
- Employee: employee@example.com / password

## Future Improvements

- Add Eureka Service Registry for service discovery
- Implement Spring Cloud Gateway
- Add circuit breakers and fallbacks for improved resilience
- Containerize with Docker and orchestrate with Kubernetes

## Use Case Diagram

```mermaid
graph TD
    User((User))
    Employee((Employee))
    Manager((Manager))
    
    User --> Login
    User --> Signup
    User --> ViewProfile
    
    Employee --> ViewTasks
    Employee --> UpdateTaskStatus
    Employee --> ViewCalendar
    Employee --> ViewDashboard
    
    Manager --> AssignTasks
    Manager --> ViewEmployeeTasks
    Manager --> GenerateReports
    Manager --> ManageEmployees
    Manager --> ViewDashboard
    
    subgraph Authentication
        Login
        Signup
    end
    
    subgraph Task Management
        ViewTasks
        UpdateTaskStatus
        AssignTasks
    end
    
    subgraph Employee Management
        ManageEmployees
        ViewEmployeeTasks
    end
    
    subgraph Reporting
        GenerateReports
        ViewDashboard
    end
```

## Class Diagram

```mermaid
classDiagram
    class User {
        -Long id
        -String username
        -String password
        -String email
        -String role
        +login()
        +logout()
    }
    
    class Employee {
        -Long id
        -String name
        -String department
        +viewTasks()
        +updateTaskStatus()
    }
    
    class Manager {
        -Long id
        -String name
        -String department
        +assignTask()
        +viewEmployeeTasks()
        +generateReport()
    }
    
    class Task {
        -Long id
        -String title
        -String description
        -String status
        -Date dueDate
        -Employee assignee
        +updateStatus()
        +assignTo()
    }
    
    class Dashboard {
        -Long id
        -List~Task~ tasks
        -List~Employee~ employees
        +displayTasks()
        +displayEmployees()
    }
    
    User <|-- Employee
    User <|-- Manager
    Employee "1" -- "many" Task
    Manager "1" -- "many" Task
    Manager "1" -- "many" Employee
    Dashboard "1" -- "many" Task
    Dashboard "1" -- "many" Employee
```

## Setup Instructions

1. Clone the repository
2. Set up the backend:
   ```bash
   cd taskflow-backend
   mvn clean install
   mvn spring-boot:run
   ```
3. Open the frontend files in your preferred web browser

## Screenshots
![image](https://github.com/user-attachments/assets/631a4233-07a2-47bb-bf79-67068e964d67)

![image](https://github.com/user-attachments/assets/f608f4d5-8f2c-4e1d-b3b0-b2ef0318bc13)

![image](https://github.com/user-attachments/assets/7cb2a78a-d029-47b6-b4fc-bbb5001d3191)

