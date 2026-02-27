package br.edu.unifio.odonto.desapego.upload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {

    private String url;

    public static UploadResponse of(String url) {
        return UploadResponse.builder().url(url).build();
    }
}
