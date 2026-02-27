package br.edu.unifio.odonto.desapego.listing.controller;

import br.edu.unifio.odonto.desapego.common.response.ApiResponse;
import br.edu.unifio.odonto.desapego.common.response.PagedResponse;
import br.edu.unifio.odonto.desapego.listing.domain.ListingStatus;
import br.edu.unifio.odonto.desapego.listing.dto.*;
import br.edu.unifio.odonto.desapego.listing.service.ListingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/listings")
@Tag(name = "Listings", description = "CRUD de anúncios e listagem com filtros")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Criar anúncio", description = "Requer autenticação. O usuário logado é o vendedor.")
    public ResponseEntity<ApiResponse<ListingResponse>> create(
            @Valid @RequestBody CreateListingRequest request,
            Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        ListingResponse created = listingService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created));
    }

    @GetMapping
    @Operation(summary = "Listar anúncios", description = "Paginado. Filtros: status, sellerId, search (título/descrição). Público.")
    public ResponseEntity<ApiResponse<PagedResponse<ListingSummaryResponse>>> list(
            @RequestParam(required = false) ListingStatus status,
            @RequestParam(required = false) UUID sellerId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        ListingFilter filter = ListingFilter.of(status, sellerId, search, page, size);
        PagedResponse<ListingSummaryResponse> result = listingService.list(filter);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar anúncio por ID", description = "Público.")
    public ResponseEntity<ApiResponse<ListingResponse>> getById(@PathVariable UUID id) {
        ListingResponse listing = listingService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(listing));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Atualizar anúncio", description = "Requer autenticação. Apenas o dono pode atualizar.")
    public ResponseEntity<ApiResponse<ListingResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateListingRequest request,
            Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        ListingResponse updated = listingService.update(id, userId, request);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Excluir anúncio", description = "Requer autenticação. Apenas o dono pode excluir.")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        listingService.delete(id, userId);
        return ResponseEntity.ok(ApiResponse.okWithMessage("Anúncio excluído"));
    }
}
