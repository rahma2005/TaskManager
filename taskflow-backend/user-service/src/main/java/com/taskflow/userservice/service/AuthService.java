package com.taskflow.userservice.service;

import com.taskflow.userservice.model.User;
import com.taskflow.userservice.repository.UserRepository;
import com.taskflow.userservice.util.JwtUtil;
import com.taskflow.userservice.dto.RegisterRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setJoinDate(new Date());
        user.setStatus(User.Status.ACTIVE); // Default

        userRepository.save(user);
        return "User registered successfully";
    }

    public Map<String, String> loginUserByEmail(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        Map<String, String> result = new HashMap<>();
        result.put("token", token);
        result.put("role", user.getRole().name());
        result.put("name", user.getName());
        return result;
    }
} 