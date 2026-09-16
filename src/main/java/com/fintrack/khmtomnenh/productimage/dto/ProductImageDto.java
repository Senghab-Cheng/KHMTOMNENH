package com.fintrack.khmtomnenh.productimage.dto; import jakarta.validation.constraints.*; public record ProductImageDto(@NotBlank @Size(max=1000) String imageUrl){}
