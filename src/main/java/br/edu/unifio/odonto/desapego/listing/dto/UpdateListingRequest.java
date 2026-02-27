package br.edu.unifio.odonto.desapego.listing.dto;

import br.edu.unifio.odonto.desapego.listing.domain.ListingStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdateListingRequest {

    @Size(max = 255)
    private String title;

    @Size(max = 10000)
    private String description;

    private BigDecimal price;

    private ListingStatus status;

    @Size(max = 20)
    private List<String> imageUrls;
}
