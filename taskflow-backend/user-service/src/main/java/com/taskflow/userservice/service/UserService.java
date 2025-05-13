package com.taskflow.userservice.service;

import com.taskflow.userservice.model.User;
import com.taskflow.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User registerUser(User user) {
        // Check if the username already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalStateException("Username already exists");
        }

        // Check if the email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user to the database
        return userRepository.save(user);
    }

    public List<User> getAllEmployeesFiltered(String status, String department, String search) {
        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == User.Role.EMPLOYEE)
            .filter(user -> status == null || status.isEmpty() || (user.getStatus() != null && user.getStatus().name().equalsIgnoreCase(status)))
            .filter(user -> department == null || department.isEmpty() || (user.getDepartment() != null && user.getDepartment().equalsIgnoreCase(department)))
            .filter(user -> search == null || search.isEmpty() ||
                (user.getUsername() != null && user.getUsername().toLowerCase().contains(search.toLowerCase())) ||
                (user.getEmail() != null && user.getEmail().toLowerCase().contains(search.toLowerCase()))
            )
            .collect(Collectors.toList());
    }

    public List<User> getAllEmployees() {
        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == User.Role.EMPLOYEE)
            .collect(Collectors.toList());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getRecentEmployees(int limit) {
        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == User.Role.EMPLOYEE)
            .limit(limit)
            .collect(Collectors.toList());
    }
} 