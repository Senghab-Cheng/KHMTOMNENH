package com.fintrack.khmtomnenh.auth.service;

import com.fintrack.khmtomnenh.auth.dto.AuthResponse;
import com.fintrack.khmtomnenh.auth.dto.LoginRequest;
import com.fintrack.khmtomnenh.auth.dto.RegisterRequest;
import com.fintrack.khmtomnenh.auth.entity.Auth;
import com.fintrack.khmtomnenh.auth.repository.AuthRepository;
import com.fintrack.khmtomnenh.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        String fullName = request.fullName().trim();
        int nameSeparator = fullName.indexOf(' ');
        String firstName = nameSeparator > 0 ? fullName.substring(0, nameSeparator) : fullName;
        String lastName = nameSeparator > 0 ? fullName.substring(nameSeparator + 1).trim() : "";
        if (authRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Auth user = Auth.builder()
                .fullName(fullName)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .mobileNumber(request.mobileNumber().trim())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .enabled(true)
                .build();

        Auth savedUser = authRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Auth user = authRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
