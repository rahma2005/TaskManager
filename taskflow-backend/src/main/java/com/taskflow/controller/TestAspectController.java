package com.taskflow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-aspect")
public class TestAspectController {

    /**
     * Endpoint to test the exception handling aspect
     * This method intentionally throws an exception to trigger the aspect
     */
    @GetMapping("/exception")
    public String testExceptionHandlingAspect() {
        // Intentionally throw an exception to test the aspect
        throw new RuntimeException("This is a test exception to verify the exception handling aspect");
    }
    
    /**
     * Endpoint to test the logging aspect
     * This method simply returns a message, but the aspect will log its execution time
     */
    @GetMapping("/logging")
    public String testLoggingAspect() {
        // Add a small delay to make the execution time measurable
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        return "Logging aspect test successful. Check logs for execution time.";
    }
} 