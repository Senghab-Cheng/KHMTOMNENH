package com.fintrack.khmtomnenh.company.entity;

import com.fintrack.khmtomnenh.auth.entity.Auth;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "companies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Company {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Auth owner;
    @Column(nullable = false)
    private String name;
    private String description;
    private String email;
    private String phone;
    private String address;
    @Column(nullable = false)
    private String country;
    @Column(nullable = false)
    private String city;
    @Builder.Default
    @Column(name = "verification_status", nullable = false)
    private String verificationStatus = "PENDING";
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}