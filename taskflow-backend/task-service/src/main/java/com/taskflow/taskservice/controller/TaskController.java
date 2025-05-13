package com.taskflow.taskservice.controller;

import com.taskflow.taskservice.model.Task;
import com.taskflow.taskservice.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
            .map(task -> ResponseEntity.ok(task))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        try {
            // Set the current user's username as the assignee
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = auth.getName();
            task.setAssignee(currentUsername);
            
            Task savedTask = taskService.saveTask(task);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create task: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task task) {
        try {
            Task existingTask = taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
            
            // Preserve the original assignee
            task.setAssignee(existingTask.getAssignee());
            task.setId(id);
            
            Task updatedTask = taskService.saveTask(task);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update task: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete task: " + e.getMessage());
        }
    }

    @GetMapping("/preview")
    public List<Task> getTasksPreview() {
        return taskService.getRecentTasks(4);
    }

    @GetMapping("/assigned")
    public List<Task> getTasksAssignedToCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        return taskService.getTasksByAssignedTo(currentUsername);
    }

    @GetMapping("/created")
    public List<Task> getTasksCreatedByCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        return taskService.getTasksByAssignee(currentUsername);
    }
    
    @GetMapping("/filter")
    public List<Task> filterTasks(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String assignedTo
    ) {
        // You could implement a method in TaskService to filter tasks
        // For now, we'll just return all tasks
        return taskService.getAllTasks();
    }
} 