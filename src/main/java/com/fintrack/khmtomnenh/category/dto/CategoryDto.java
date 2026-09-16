package com.fintrack.khmtomnenh.category.dto; import jakarta.validation.constraints.NotBlank;
public record CategoryDto(@NotBlank String name, String description) {}
