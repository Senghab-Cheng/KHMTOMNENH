package com.fintrack.khmtomnenh.auth.dto;

import com.fintrack.khmtomnenh.auth.entity.Role;

public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String fullName,
        String email,
        Role role
) {
}
