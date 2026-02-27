package br.edu.unifio.odonto.desapego.listing.repository;

import br.edu.unifio.odonto.desapego.listing.domain.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {

    @Query("""
        SELECT l FROM Listing l
        LEFT JOIN FETCH l.user
        WHERE (:status IS NULL OR l.status = :status)
        AND (:sellerId IS NULL OR l.user.id = :sellerId)
        AND (:search IS NULL OR :search = '' OR LOWER(l.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY l.createdAt DESC
        """)
    Page<Listing> findAllWithFilters(
            @Param("status") String status,
            @Param("sellerId") UUID sellerId,
            @Param("search") String search,
            Pageable pageable);

    boolean existsByIdAndUserId(UUID id, UUID userId);
}
