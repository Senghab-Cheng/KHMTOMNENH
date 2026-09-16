package com.fintrack.khmtomnenh.company.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CompanyDto(@NotBlank String name, String description, @Email String email,
                          String phone, String address, @NotBlank String country,
                          @NotBlank String city) {}