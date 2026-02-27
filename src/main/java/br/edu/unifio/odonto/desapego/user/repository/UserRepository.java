package br.edu.unifio.odonto.desapego.user.repository;

import br.edu.unifio.odonto.desapego.user.domain.User;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
