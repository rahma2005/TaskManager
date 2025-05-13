package com.taskflow.taskservice.client;

import com.taskflow.taskservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserServiceClient {
    
    @GetMapping("/users/{username}")
    UserDto getUserByUsername(@PathVariable("username") String username);
    
    @GetMapping("/users/id/{id}")
    UserDto getUserById(@PathVariable("id") Long id);
} 