package com.fintrack.khmtomnenh.company.repository; import com.fintrack.khmtomnenh.auth.entity.Auth; import com.fintrack.khmtomnenh.company.entity.Company; import java.util.*; import org.springframework.data.jpa.repository.*;
public interface CompanyRepository extends JpaRepository<Company,Long>{ List<Company> findByOwner(Auth owner); boolean existsByIdAndOwner(Long id,Auth owner); }
