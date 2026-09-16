package com.fintrack.khmtomnenh.category.repository; import com.fintrack.khmtomnenh.category.entity.Category; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoryRepository extends JpaRepository<Category,Long>{ boolean existsByNameIgnoreCase(String name); List<Category> findByActiveTrueOrderByNameAsc(); }
