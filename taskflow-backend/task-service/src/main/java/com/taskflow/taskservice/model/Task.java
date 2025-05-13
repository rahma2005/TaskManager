package com.taskflow.taskservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String assignee;        // Manager's username who created/assigned the task
    private String assignedTo;      // Employee's username assigned to complete the task

    private String title;
    private String description;
    private String status;
    private String priority;
    private Date dueDate;
} 