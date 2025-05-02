CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) DEFAULT 'images/profile.jpg',
    phone VARCHAR(20),
    birth_date DATE,
    location VARCHAR(255),
    join_date DATE,
    position VARCHAR(255),
    role ENUM('EMPLOYEE', 'MANAGER') NOT NULL,
    department VARCHAR(255),
    status ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE')
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_id BIGINT,
    skills VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    assignee VARCHAR(255),        -- Manager's username who assigned the task
    assigned_to VARCHAR(255),     -- Employee's username who needs to complete the task
    priority ENUM('HIGH', 'MEDIUM', 'LOW'),
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'),
    due_date DATE,
    FOREIGN KEY (assignee) REFERENCES users(username),
    FOREIGN KEY (assigned_to) REFERENCES users(username)
);

