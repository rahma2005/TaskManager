package com.taskflow.taskservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String role;  // Will be stored as string from User.Role enum
    private String status; // Will be stored as string from User.Status enum
    private String department;
    
    // We don't need to expose all User fields in this DTO,
    // just the ones needed for task management
} 