package com.taskflow.controller;

import com.taskflow.repository.UserRepository;
import com.taskflow.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.taskflow.model.User;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:8080") // Allow frontend requests
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/summary")
    public Map<String, Long> getDashboardSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("totalEmployees", userRepository.countByRole(User.Role.EMPLOYEE));
        summary.put("activeTasks", taskRepository.countByStatus("IN_PROGRESS"));
        summary.put("completedTasks", taskRepository.countByStatus("Completed"));
        summary.put("pendingTasks", taskRepository.countByStatus("Pending"));
        return summary;
    }
}
