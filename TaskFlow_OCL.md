# TaskFlow - OCL Constraints Documentation

This document outlines the Object Constraint Language (OCL) constraints for the TaskFlow application, based on the analysis of the application's class structure.

## 1. User Class Constraints

```ocl
context User
-- Username must be between 4 and 20 characters
inv UsernameLength: 
    self.username.size() >= 4 and self.username.size() <= 20

-- Email must not be blank and should be valid format
inv ValidEmail:
    not self.email.oclIsUndefined() and self.email.size() > 0

-- Password must not be blank
inv PasswordNotBlank:
    not self.password.oclIsUndefined() and self.password.size() > 0

-- User must have a valid role (MANAGER or EMPLOYEE)
inv ValidRole:
    self.role = Role::MANAGER or self.role = Role::EMPLOYEE

-- User must have a valid status
inv ValidStatus:
    self.status = Status::ACTIVE or self.status = Status::INACTIVE or self.status = Status::ON_LEAVE

-- Manager-specific constraints
inv ManagerConstraints:
    self.role = Role::MANAGER implies 
    (not self.department.oclIsUndefined() and self.department.size() > 0)

-- If user has skills, they must be properly initialized
inv SkillsInitialized:
    not self.skills.oclIsUndefined() implies self.skills->notEmpty()

-- Join date must be before or equal to current date
inv ValidJoinDate:
    not self.joinDate.oclIsUndefined() implies self.joinDate <= Date::now()
```

## 2. Task Class Constraints

```ocl
context Task
-- Task must have a non-empty title
inv TaskTitleNotEmpty:
    not self.title.oclIsUndefined() and self.title.size() > 0

-- Task must have a valid status
inv TaskStatusValid:
    self.status = 'PENDING' or self.status = 'IN_PROGRESS' or self.status = 'COMPLETED'

-- Task must have a valid priority
inv TaskPriorityValid:
    self.priority = 'LOW' or self.priority = 'MEDIUM' or self.priority = 'HIGH'

-- Due date must be defined for tasks
inv TaskDueDateDefined:
    not self.dueDate.oclIsUndefined()

-- Task must be assigned by a user (manager)
inv TaskAssignerExists:
    not self.assignee.oclIsUndefined() and self.assignee.size() > 0

-- Task must be assigned to a user (employee)
inv TaskAssigneeExists:
    not self.assignedTo.oclIsUndefined() and self.assignedTo.size() > 0
```

## 3. User Service Constraints

```ocl
context UserRepository
-- No two users can have the same username
inv UniqueUsername:
    User.allInstances()->forAll(u1, u2 | u1 <> u2 implies u1.username <> u2.username)

-- No two users can have the same email
inv UniqueEmail:
    User.allInstances()->forAll(u1, u2 | u1 <> u2 implies u1.email <> u2.email)

-- A department must have at least one manager
inv DepartmentHasManager:
    User.allInstances()->select(u | not u.department.oclIsUndefined())
        ->collect(u | u.department)->asSet()
        ->forAll(d | User.allInstances()
            ->exists(u | u.department = d and u.role = Role::MANAGER))
```

## 4. Task Service Constraints

```ocl
context TaskRepository
-- A task cannot be in completed status if its due date is in the future
inv CompletedTaskDueDateValid:
    Task.allInstances()->forAll(t | t.status = 'COMPLETED' implies t.dueDate <= Date::now())

-- Tasks assigned to a non-existent user are invalid
inv TaskAssignedToValidUser:
    Task.allInstances()->forAll(t | 
        User.allInstances()->exists(u | u.username = t.assignedTo))

-- Tasks created by a non-existent user are invalid
inv TaskCreatedByValidUser:
    Task.allInstances()->forAll(t | 
        User.allInstances()->exists(u | u.username = t.assignee))

-- A user cannot assign a task to themselves if they are not a manager
inv ManagerTaskAssignmentRule:
    Task.allInstances()->forAll(t | 
        t.assignee = t.assignedTo implies
        User.allInstances()->exists(u | u.username = t.assignee and u.role = Role::MANAGER))
```

## 5. Inter-Service Constraints

```ocl
context UserServiceClient
-- Task Service must validate user existence through User Service before creating tasks
inv ValidateUserBeforeTaskCreation:
    Task.allInstances()->forAll(t | 
        UserDto.allInstances()->exists(u | u.username = t.assignedTo))

-- Task Service must validate that the assignee has manager role
inv ValidateManagerRoleForTaskAssignment:
    Task.allInstances()->forAll(t | 
        UserDto.allInstances()->exists(u | 
            u.username = t.assignee and u.role = 'MANAGER'))
```

## 6. System-Wide Invariants

```ocl
-- All active employees must have at least one task assigned
context User
inv ActiveEmployeeHasTask:
    self.role = Role::EMPLOYEE and self.status = Status::ACTIVE implies
    Task.allInstances()->exists(t | t.assignedTo = self.username)

-- No tasks can be assigned to inactive employees
context Task
inv NoTasksForInactiveEmployees:
    User.allInstances()->forAll(u | 
        u.username = self.assignedTo implies u.status <> Status::INACTIVE)

-- Every task must have a valid assignee and assignedTo
inv TaskUserAssociationsValid:
    not self.assignee.oclIsUndefined() and not self.assignedTo.oclIsUndefined() and
    User.allInstances()->exists(u | u.username = self.assignee) and
    User.allInstances()->exists(u | u.username = self.assignedTo)
``` 