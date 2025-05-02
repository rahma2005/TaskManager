package com.taskflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskflow.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    long countByStatus(String status);
    List<Task> findByAssignedTo(String username);
    List<Task> findByAssignee(String username);
}
