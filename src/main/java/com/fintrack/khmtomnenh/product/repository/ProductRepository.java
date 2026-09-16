package com.fintrack.khmtomnenh.product.repository; import com.fintrack.khmtomnenh.product.entity.Product; import java.util.*; import org.springframework.data.jpa.repository.*;
public interface ProductRepository extends JpaRepository<Product,Long>{List<Product> findByActiveTrueOrderByCreatedAtDesc();List<Product> findByCompanyOwnerId(Long ownerId);}
