package com.taskflow.service;

import com.taskflow.model.Task;
import com.taskflow.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getRecentTasks(int limit) {
        return taskRepository.findAll().stream()
            // .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt())) // sort by latest created
            .limit(limit)
            .collect(Collectors.toList());
    }

    public List<Task> getTasksByAssignedTo(String username) {
        return taskRepository.findByAssignedTo(username);
    }

    public List<Task> getTasksByAssignee(String username) {
        return taskRepository.findByAssignee(username);
    }

}
