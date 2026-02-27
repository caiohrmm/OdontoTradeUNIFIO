package br.edu.unifio.odonto.desapego.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 255)
    private String name;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    @Size(max = 255)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 100)
    private String password;
}
