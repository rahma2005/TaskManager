package com.taskflow.taskservice.repository;

import com.taskflow.taskservice.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    long countByStatus(String status);
    List<Task> findByAssignedTo(String username);
    List<Task> findByAssignee(String username);
} 