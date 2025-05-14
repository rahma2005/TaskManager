package com.taskflow.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @NotBlank
    @Size(min = 4, max = 20)
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "profile_picture")
    private String profilePicture = "images/profile.png";

    @Column(name = "phone")
    private String phone;

    @Column(name = "birth_date")
    @Temporal(TemporalType.DATE)
    private Date birthDate;

    @Column(name = "location")
    private String location;

    @Column(name = "skills")
    @ElementCollection
    private List<String> skills;

    @Column(name = "join_date")
    @Temporal(TemporalType.DATE)
    private Date joinDate;

    @Column(name = "position")
    private String position;

    private String department;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Role {
        MANAGER, EMPLOYEE
    }

    public enum Status {
        ACTIVE, INACTIVE, ON_LEAVE
    }
} 