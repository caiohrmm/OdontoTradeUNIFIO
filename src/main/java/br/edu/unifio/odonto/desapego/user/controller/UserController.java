package br.edu.unifio.odonto.desapego.user.controller;

import br.edu.unifio.odonto.desapego.common.response.ApiResponse;
import br.edu.unifio.odonto.desapego.user.domain.User;
import br.edu.unifio.odonto.desapego.user.dto.UserMeResponse;
import br.edu.unifio.odonto.desapego.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User", description = "Dados do usuário autenticado")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Usuário atual", description = "Retorna dados do usuário autenticado (requer JWT)")
    public ResponseEntity<ApiResponse<UserMeResponse>> me(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        User user = userService.getById(userId);
        UserMeResponse dto = UserMeResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
