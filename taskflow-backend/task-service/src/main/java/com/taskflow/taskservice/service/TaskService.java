package com.taskflow.taskservice.service;

import com.taskflow.taskservice.model.Task;
import com.taskflow.taskservice.repository.TaskRepository;
import com.taskflow.taskservice.client.UserServiceClient;
import com.taskflow.taskservice.dto.UserDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserServiceClient userServiceClient;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task saveTask(Task task) {
        // Validate if the assignedTo user exists (if specified)
        if (task.getAssignedTo() != null && !task.getAssignedTo().isEmpty()) {
            try {
                // Call user-service to check if user exists
                UserDto user = userServiceClient.getUserByUsername(task.getAssignedTo());
                if (user == null) {
                    throw new IllegalArgumentException("Assigned user does not exist");
                }
            } catch (Exception e) {
                throw new IllegalArgumentException("Error validating assigned user: " + e.getMessage());
            }
        }
        
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getRecentTasks(int limit) {
        return taskRepository.findAll().stream()
            .limit(limit)
            .collect(Collectors.toList());
    }

    public List<Task> getTasksByAssignedTo(String username) {
        // Validate if user exists before getting tasks
        try {
            UserDto user = userServiceClient.getUserByUsername(username);
            if (user == null) {
                throw new IllegalArgumentException("User does not exist");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error validating user: " + e.getMessage());
        }
        
        return taskRepository.findByAssignedTo(username);
    }

    public List<Task> getTasksByAssignee(String username) {
        return taskRepository.findByAssignee(username);
    }
} 