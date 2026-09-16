package com.fintrack.khmtomnenh.product.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductDto(@NotNull Long companyId, @NotNull Long categoryId, @NotBlank String name, String description,
                         @NotNull @DecimalMin("0.00") BigDecimal price,
                         @NotNull @Min(0) Integer stockQuantity) {}