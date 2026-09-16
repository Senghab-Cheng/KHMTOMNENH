package com.fintrack.khmtomnenh.category.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime; import org.hibernate.annotations.*;
@Entity @Table(name="categories") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false,unique=true) private String name; private String description; @Builder.Default @Column(nullable=false) private Boolean active=true; @CreationTimestamp @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt; @UpdateTimestamp @Column(name="updated_at") private LocalDateTime updatedAt; }
