package br.edu.unifio.odonto.desapego.listing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {

    private UUID id;
    private UUID sellerId;
    private String sellerName;
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private List<String> imageUrls;
    private Instant createdAt;
    private Instant updatedAt;
}
