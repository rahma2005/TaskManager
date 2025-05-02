package com.taskflow.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
public class ExceptionHandlingAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandlingAspect.class);
    
    /**
     * AfterThrowing advice for all methods in service and controller packages
     * to log exceptions without affecting the normal exception flow
     */
    @AfterThrowing(
        pointcut = "com.taskflow.aspect.CommonPointcuts.serviceAndControllerMethods()",
        throwing = "exception"
    )
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String methodName = method.getDeclaringClass().getSimpleName() + "." + method.getName();
        
        logger.error("Exception in {}: {} - {}", 
                    methodName, 
                    exception.getClass().getSimpleName(),
                    exception.getMessage());
        
        // Log stack trace for debugging purposes at a lower level
        logger.debug("Stack trace for exception in {}:", methodName, exception);
    }
} 