package com.fintrack.khmtomnenh.auth.dto;

import com.fintrack.khmtomnenh.auth.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(max = 30) String mobileNumber,
        @NotBlank @Size(min = 8, max = 100) String password,
        @NotNull Role role
) {
}
