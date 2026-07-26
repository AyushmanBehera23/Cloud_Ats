package com.cloudats.auth.exception;

import com.cloudats.auth.dto.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<MessageResponse> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();

        if (message != null && (message.contains("Invalid email or password") ||
                message.contains("Invalid refresh token") ||
                message.contains("Invalid token") ||
                message.contains("expired"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.error(message));
        }

        if (message != null && message.contains("already registered")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(MessageResponse.error(message));
        }

        if (message != null && message.contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.error(message));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(MessageResponse.error(message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        response.put("success", false);
        response.put("message", "Validation failed");
        response.put("errors", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
