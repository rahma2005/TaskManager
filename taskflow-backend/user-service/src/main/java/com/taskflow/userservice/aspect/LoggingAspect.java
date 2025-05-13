package com.taskflow.userservice.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Aspect for logging method execution time
 */
@Aspect
@Component
public class LoggingAspect {
    
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    
    /**
     * Logs execution time for all methods in service and controller packages
     */
    @Around("execution(* com.taskflow.userservice.service..*.*(..)) || " +
            "execution(* com.taskflow.userservice.controller..*.*(..))")
    public Object logMethodExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        // Get method signature
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        
        // Start timer
        long startTime = System.currentTimeMillis();
        
        // Execute method
        Object result = joinPoint.proceed();
        
        // End timer
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        
        // Log method execution time
        log.info("Method {}::{} executed successfully in {} ms", 
                className, methodName, executionTime);
        
        return result;
    }
} 