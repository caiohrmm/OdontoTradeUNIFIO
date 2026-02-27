package br.edu.unifio.odonto.desapego.listing.dto;

import br.edu.unifio.odonto.desapego.listing.domain.ListingStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ListingFilter {

    private ListingStatus status;
    private UUID sellerId;
    private String search;
    private int page;
    private int size;

    public static ListingFilter of(ListingStatus status, UUID sellerId, String search, int page, int size) {
        return ListingFilter.builder()
                .status(status)
                .sellerId(sellerId)
                .search(search != null && search.isBlank() ? null : search)
                .page(page)
                .size(size <= 0 ? 20 : Math.min(size, 100))
                .build();
    }
}
