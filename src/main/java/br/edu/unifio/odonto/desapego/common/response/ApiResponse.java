package br.edu.unifio.odonto.desapego.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Resposta padrão da API para padronizar o formato JSON.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private String status;
    private Instant timestamp;
    private T data;
    private String message;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .status("ok")
                .timestamp(Instant.now())
                .data(data)
                .build();
    }

    public static ApiResponse<Void> okWithMessage(String message) {
        return ApiResponse.<Void>builder()
                .status("ok")
                .timestamp(Instant.now())
                .message(message)
                .build();
    }
}
