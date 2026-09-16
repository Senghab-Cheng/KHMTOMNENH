package com.fintrack.khmtomnenh.product.entity;

import com.fintrack.khmtomnenh.company.entity.Company;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    @Column(name = "category_id", nullable = false)
    private Long categoryId;
    @Column(nullable = false) private String name;
    private String description;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal price;
    @Column(name = "stock_quantity", nullable = false) private Integer stockQuantity;
    @Builder.Default @Column(nullable = false) private Boolean active = true;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}