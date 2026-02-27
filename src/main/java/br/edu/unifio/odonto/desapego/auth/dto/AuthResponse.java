package br.edu.unifio.odonto.desapego.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String type;
    private UUID userId;
    private String email;
    private String name;
    private String role;

    public static AuthResponse of(String token, UUID userId, String email, String name, String role) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(userId)
                .email(email)
                .name(name)
                .role(role != null ? role : "USER")
                .build();
    }
}
