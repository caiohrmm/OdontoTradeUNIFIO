package br.edu.unifio.odonto.desapego.upload.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryUploadService {

    @Autowired(required = false)
    private Cloudinary cloudinary;

    @Value("${cloudinary.folder:desapego}")
    private String folder;

    @Value("${cloudinary.max-file-size-mb:5}")
    private int maxFileSizeMb;

    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg", "image/png", "image/gif", "image/webp"
    };

    /**
     * Envia um arquivo para o Cloudinary e retorna a URL segura.
     * Requer que o bean Cloudinary esteja configurado (credenciais válidas).
     */
    public String upload(MultipartFile file) throws IOException {
        if (cloudinary == null) {
            throw new IllegalStateException("Upload não configurado. Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.");
        }
        validateFile(file);
        Path tempFile = null;
        try {
            tempFile = Files.createTempFile("desapego-upload-", getExtension(file.getOriginalFilename()));
            file.transferTo(tempFile.toFile());
            Map<?, ?> options = ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", UUID.randomUUID().toString(),
                    "resource_type", "image");
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(tempFile.toFile(), options);
            String url = (String) result.get("secure_url");
            if (url == null) {
                url = (String) result.get("url");
            }
            return url;
        } finally {
            if (tempFile != null) {
                Files.deleteIfExists(tempFile);
            }
        }
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
