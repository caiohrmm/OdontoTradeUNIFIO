package br.edu.unifio.odonto.desapego.listing.service;

import br.edu.unifio.odonto.desapego.common.response.PagedResponse;
import br.edu.unifio.odonto.desapego.category.domain.Category;
import br.edu.unifio.odonto.desapego.category.service.CategoryService;
import br.edu.unifio.odonto.desapego.listing.domain.Listing;
import br.edu.unifio.odonto.desapego.listing.domain.ListingImage;
import br.edu.unifio.odonto.desapego.listing.domain.ListingStatus;
import br.edu.unifio.odonto.desapego.listing.dto.*;
import br.edu.unifio.odonto.desapego.listing.repository.ListingRepository;
import br.edu.unifio.odonto.desapego.user.domain.User;
import br.edu.unifio.odonto.desapego.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserService userService;
    private final CategoryService categoryService;

    @Transactional
    public ListingResponse create(UUID userId, CreateListingRequest request) {
        User user = userService.getById(userId);
        Category category = request.getCategoryId() != null ? categoryService.getEntityById(request.getCategoryId()) : null;
        Listing listing = Listing.builder()
                .user(user)
                .category(category)
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .price(request.getPrice())
                .status(ListingStatus.ACTIVE.name())
                .build();
        setImages(listing, request.getImageUrls());
        listing = listingRepository.save(listing);
        return toResponse(listing);
    }

    @Transactional
    public ListingResponse update(UUID listingId, UUID userId, UpdateListingRequest request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Anúncio não encontrado"));
        if (!listing.isOwnedBy(userId)) {
            throw new IllegalArgumentException("Sem permissão para editar este anúncio");
        }
        if (request.getTitle() != null) listing.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) listing.setDescription(request.getDescription().trim());
        if (request.getPrice() != null) listing.setPrice(request.getPrice());
        if (request.getStatus() != null) listing.setStatus(request.getStatus().name());
        if (request.getCategoryId() != null) {
            Category cat = categoryService.getEntityById(request.getCategoryId());
            listing.setCategory(cat);
        }
        if (request.getImageUrls() != null) {
            listing.getImages().clear();
            setImages(listing, request.getImageUrls());
        }
        listing = listingRepository.save(listing);
        return toResponse(listing);
    }

    @Transactional(readOnly = true)
    public ListingResponse getById(UUID id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Anúncio não encontrado"));
        return toResponse(listing);
    }

    @Transactional
    public void delete(UUID listingId, UUID userId) {
        if (!listingRepository.existsByIdAndUserId(listingId, userId)) {
            if (!listingRepository.existsById(listingId)) {
                throw new IllegalArgumentException("Anúncio não encontrado");
            }
            throw new IllegalArgumentException("Sem permissão para excluir este anúncio");
        }
        listingRepository.deleteById(listingId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ListingSummaryResponse> list(ListingFilter filter) {
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize());
        String statusStr = filter.getStatus() != null ? filter.getStatus().name() : null;
        Page<Listing> page = listingRepository.findAllWithFilters(
                statusStr,
                filter.getSellerId(),
                filter.getCategoryId(),
                filter.getSearch(),
                pageable);
        List<ListingSummaryResponse> content = page.getContent().stream()
                .map(this::toSummaryResponse)
                .toList();
        return PagedResponse.of(
                content,
                page.getTotalElements(),
                page.getTotalPages(),
                page.getSize(),
                page.getNumber());
    }

    private void setImages(Listing listing, List<String> urls) {
        if (urls == null || urls.isEmpty()) return;
        listing.getImages().clear();
        int pos = 0;
        for (String url : urls) {
            if (url != null && !url.isBlank()) {
                listing.getImages().add(ListingImage.builder()
                        .listing(listing)
                        .url(url.trim())
                        .position(pos++)
                        .build());
            }
        }
    }

    private List<String> getImageUrls(Listing listing) {
        if (listing.getImages() == null) return List.of();
        return listing.getImages().stream()
                .map(ListingImage::getUrl)
                .toList();
    }

    private ListingResponse toResponse(Listing listing) {
        Category cat = listing.getCategory();
        return ListingResponse.builder()
                .id(listing.getId())
                .sellerId(listing.getUser().getId())
                .sellerName(listing.getUser().getName())
                .categoryId(cat != null ? cat.getId() : null)
                .categoryName(cat != null ? cat.getName() : null)
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .status(listing.getStatus())
                .imageUrls(getImageUrls(listing))
                .createdAt(listing.getCreatedAt())
                .updatedAt(listing.getUpdatedAt())
                .build();
    }

    private ListingSummaryResponse toSummaryResponse(Listing listing) {
        Category cat = listing.getCategory();
        return ListingSummaryResponse.builder()
                .id(listing.getId())
                .sellerId(listing.getUser().getId())
                .sellerName(listing.getUser().getName())
                .categoryId(cat != null ? cat.getId() : null)
                .categoryName(cat != null ? cat.getName() : null)
                .title(listing.getTitle())
                .price(listing.getPrice())
                .status(listing.getStatus())
                .imageUrls(getImageUrls(listing))
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
