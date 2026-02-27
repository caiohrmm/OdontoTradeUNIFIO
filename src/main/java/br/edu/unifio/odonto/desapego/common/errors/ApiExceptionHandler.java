package br.edu.unifio.odonto.desapego.common.errors;

import br.edu.unifio.odonto.desapego.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleIllegalArgument(IllegalArgumentException ex) {
        String message = ex.getMessage();
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if ("E-mail já cadastrado".equals(message)) {
            status = HttpStatus.CONFLICT;
        } else if (message != null && message.contains("senha inválidos")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if ("Usuário não encontrado".equals(message) || "Anúncio não encontrado".equals(message)) {
            status = HttpStatus.NOT_FOUND;
        } else if (message != null && message.contains("Sem permissão")) {
            status = HttpStatus.FORBIDDEN;
        }
        var body = ApiResponse.<Map<String, String>>builder()
                .status("error")
                .timestamp(Instant.now())
                .message(message)
                .data(Map.of("error", message != null ? message : "Bad request"))
                .build();
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, e -> e.getDefaultMessage() != null ? e.getDefaultMessage() : "invalid"));
        var body = ApiResponse.<Map<String, String>>builder()
                .status("error")
                .timestamp(Instant.now())
                .message("Erro de validação")
                .data(errors)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
