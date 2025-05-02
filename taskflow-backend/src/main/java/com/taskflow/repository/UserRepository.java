package com.taskflow.repository;

import java.util.List;

import com.taskflow.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    List<User> findByStatus(User.Status status);

    List<User> findByDepartment(String department);

    List<User> findByStatusAndDepartment(User.Status status, String department);

    long countByRole(User.Role role);

}
