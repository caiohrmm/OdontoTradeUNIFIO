package br.edu.unifio.odonto.desapego.category.service;

import br.edu.unifio.odonto.desapego.category.domain.Category;
import br.edu.unifio.odonto.desapego.category.dto.CategoryResponse;
import br.edu.unifio.odonto.desapego.category.dto.CreateCategoryRequest;
import br.edu.unifio.odonto.desapego.category.dto.UpdateCategoryRequest;
import br.edu.unifio.odonto.desapego.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        return toResponse(category);
    }

    @Transactional(readOnly = true)
    public Category getEntityById(UUID id) {
        if (id == null) return null;
        return categoryRepository.findById(id).orElse(null);
    }

    @Transactional
    public CategoryResponse create(CreateCategoryRequest request) {
        String slug = toSlug(request.getSlug(), request.getName());
        if (categoryRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Já existe uma categoria com este slug");
        }
        Category category = Category.builder()
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .build();
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse update(UUID id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        if (request.getName() != null) category.setName(request.getName().trim());
        if (request.getDescription() != null) category.setDescription(request.getDescription().trim());
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String slug = request.getSlug().trim().toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", "");
            if (categoryRepository.existsBySlugAndIdNot(slug, id)) {
                throw new IllegalArgumentException("Já existe uma categoria com este slug");
            }
            category.setSlug(slug);
        }
        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Categoria não encontrada");
        }
        categoryRepository.deleteById(id);
    }

    private String toSlug(String slugInput, String name) {
        if (slugInput != null && !slugInput.isBlank()) {
            return slugInput.trim().toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", "");
        }
        if (name == null || name.isBlank()) return "categoria";
        return name.trim().toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", "");
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
