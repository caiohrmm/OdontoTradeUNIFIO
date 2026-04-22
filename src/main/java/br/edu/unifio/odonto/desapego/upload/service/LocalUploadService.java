package br.edu.unifio.odonto.desapego.upload.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalUploadService {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @Value("${upload.max-file-size-mb:5}")
    private int maxFileSizeMb;

    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg", "image/png", "image/gif", "image/webp"
    };

    public String upload(MultipartFile file) throws IOException {
        validateFile(file);
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = UUID.randomUUID() + getExtension(file.getOriginalFilename());
        Path destination = Paths.get(uploadDir, filename).toAbsolutePath();
        file.transferTo(destination);
        return "/uploads/" + filename;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo é obrigatório");
        }
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("Tipo do arquivo não identificado");
        }
        boolean allowed = false;
        for (String allowedType : ALLOWED_CONTENT_TYPES) {
            if (allowedType.equalsIgnoreCase(contentType)) {
                allowed = true;
                break;
            }
        }
        if (!allowed) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP");
        }
        long maxBytes = maxFileSizeMb * 1024L * 1024L;
        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException("Arquivo muito grande. Máximo: " + maxFileSizeMb + " MB");
        }
    }

    private static String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
