package br.edu.unifio.odonto.desapego.listing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class CreateListingRequest {

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 255)
    private String title;

    @Size(max = 10000)
    private String description;

    private BigDecimal price;

    @Size(max = 20)
    private List<String> imageUrls = new ArrayList<>();
}
