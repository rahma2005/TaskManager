package com.taskflow.userservice.controller;

import com.taskflow.userservice.model.User;
import com.taskflow.userservice.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{username}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String username, @RequestBody User updatedUser) {
        try {
            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Update user fields
            if (updatedUser.getName() != null) user.setName(updatedUser.getName());
            if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
            if (updatedUser.getBirthDate() != null) user.setBirthDate(updatedUser.getBirthDate());
            if (updatedUser.getLocation() != null) user.setLocation(updatedUser.getLocation());
            if (updatedUser.getPosition() != null) user.setPosition(updatedUser.getPosition());
            if (updatedUser.getSkills() != null) user.setSkills(updatedUser.getSkills());
            if (updatedUser.getProfilePicture() != null) user.setProfilePicture(updatedUser.getProfilePicture());

            User savedUser = userService.saveUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/employees")
    public List<User> getAllEmployees(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String department,
        @RequestParam(required = false) String search
    ) {
        return userService.getAllEmployeesFiltered(status, department, search);
    }

    @PutMapping("/employees/{id}/role")
    public ResponseEntity<?> updateEmployeeRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setRole(User.Role.valueOf(newRole));
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/employees/{id}/department")
    public ResponseEntity<?> updateEmployeeDepartment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newDepartment = body.get("department");
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setDepartment(newDepartment);
        userService.saveUser(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/employees/{id}/update")
    public ResponseEntity<?> updateEmployeeDepartmentAndStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        if (body.containsKey("department")) {
            user.setDepartment(body.get("department"));
        }
        if (body.containsKey("status")) {
            user.setStatus(User.Status.valueOf(body.get("status")));
        }
        userService.saveUser(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/employees/preview")
    public List<User> getEmployeesPreview() {
        return userService.getRecentEmployees(3);
    }
} 