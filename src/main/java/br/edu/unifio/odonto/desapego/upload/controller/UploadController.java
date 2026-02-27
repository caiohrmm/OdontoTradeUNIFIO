package br.edu.unifio.odonto.desapego.upload.controller;

import br.edu.unifio.odonto.desapego.common.response.ApiResponse;
import br.edu.unifio.odonto.desapego.upload.dto.UploadResponse;
import br.edu.unifio.odonto.desapego.upload.service.CloudinaryUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/upload")
@Tag(name = "Upload", description = "Upload de imagens para Cloudinary (retorna URL para usar em anúncios)")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryUploadService uploadService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Enviar imagem", description = "Requer autenticação. Aceita JPEG, PNG, GIF ou WebP. Retorna a URL para usar em imageUrls do anúncio.")
    public ResponseEntity<ApiResponse<UploadResponse>> upload(
            @RequestParam("file") @Schema(description = "Arquivo de imagem (JPEG, PNG, GIF, WebP)", required = true) MultipartFile file) {
        String url;
        try {
            url = uploadService.upload(file);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Falha no upload da imagem: " + e.getMessage(), e);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(UploadResponse.of(url)));
    }
}
