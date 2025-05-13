package com.taskflow.userservice.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Aspect for handling exceptions across the application
 */
@Aspect
@Component
public class ExceptionHandlingAspect {
    
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    
    /**
     * Logs exceptions thrown by methods in service and controller packages
     */
    @AfterThrowing(
        pointcut = "execution(* com.taskflow.userservice.service..*.*(..)) || " +
                  "execution(* com.taskflow.userservice.controller..*.*(..))",
        throwing = "exception"
    )
    public void logException(JoinPoint joinPoint, Exception exception) {
        // Get method signature
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        
        // Log the exception
        log.error("Exception in {}::{}: {}", 
                className, methodName, exception.getMessage());
    }
} 