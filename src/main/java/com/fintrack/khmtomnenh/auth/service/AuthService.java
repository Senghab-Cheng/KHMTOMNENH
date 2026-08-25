package com.fintrack.khmtomnenh.auth.service;

import com.fintrack.khmtomnenh.auth.dto.AuthResponse;
import com.fintrack.khmtomnenh.auth.dto.LoginRequest;
import com.fintrack.khmtomnenh.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
