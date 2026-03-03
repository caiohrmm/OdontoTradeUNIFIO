package br.edu.unifio.odonto.desapego.user.service;

import br.edu.unifio.odonto.desapego.auth.config.JwtService;
import br.edu.unifio.odonto.desapego.auth.dto.AuthResponse;
import br.edu.unifio.odonto.desapego.auth.dto.RegisterRequest;
import br.edu.unifio.odonto.desapego.user.domain.User;
import br.edu.unifio.odonto.desapego.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String ALLOWED_EMAIL_DOMAIN = "@unifio.edu.br";
    private static final String INSTITUTIONAL_EMAIL_MESSAGE =
            "Use o e-mail institucional (@unifio.edu.br) para se registrar e acessar a plataforma.";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        validateInstitutionalEmail(request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName().trim())
                .role("USER")
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return AuthResponse.of(token, user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    public AuthResponse login(String email, String password) {
        validateInstitutionalEmail(email);
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return AuthResponse.of(token, user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    public User getById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    private void validateInstitutionalEmail(String email) {
        if (email == null || !email.trim().toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)) {
            throw new IllegalArgumentException(INSTITUTIONAL_EMAIL_MESSAGE);
        }
    }
}
