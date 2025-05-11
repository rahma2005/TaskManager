# Task Manager Application

A comprehensive task management system that helps organizations manage and track tasks efficiently. The application provides features for both employees and managers to handle task assignments, tracking, and reporting.

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
- Database: (To be specified)
- Build Tool: Maven

## Project Structure

```
TaskManager/
├── taskflow-backend/     # Spring Boot Backend
├── css/                  # Stylesheets
├── js/                   # JavaScript files
├── images/              # Static images
└── templates/           # HTML templates
```

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

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 