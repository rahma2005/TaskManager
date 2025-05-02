package com.taskflow.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * Common pointcut definitions for reuse across aspects
 */
@Aspect
@Component
public class CommonPointcuts {

    /**
     * Pointcut for all service methods
     */
    @Pointcut("execution(* com.taskflow.service.*.*(..))")
    public void serviceMethods() {}
    
    /**
     * Pointcut for all controller methods
     */
    @Pointcut("execution(* com.taskflow.controller.*.*(..))")
    public void controllerMethods() {}
    
    /**
     * Pointcut for both service and controller methods
     */
    @Pointcut("serviceMethods() || controllerMethods()")
    public void serviceAndControllerMethods() {}
} 