package com.fintrack.khmtomnenh.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import com.fintrack.khmtomnenh.auth.entity.Auth;
import com.fintrack.khmtomnenh.auth.entity.Role;
import com.fintrack.khmtomnenh.auth.repository.AuthRepository;
import com.fintrack.khmtomnenh.company.entity.Company;
import com.fintrack.khmtomnenh.company.repository.CompanyRepository;
import com.fintrack.khmtomnenh.product.entity.Product;
import com.fintrack.khmtomnenh.product.repository.ProductRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class PersistenceSaveTest {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void savesUserCompanyAndProduct() {
        Auth user = authRepository.save(Auth.builder()
                .fullName("Persistence Test")
                .firstName("Persistence")
                .lastName("Test")
                .email("persistence-" + System.nanoTime() + "@example.com")
                .mobileNumber("0123456789")
                .password("encoded-password")
                .role(Role.SUPPLIER)
                .enabled(true)
                .build());

        Company company = companyRepository.save(Company.builder()
                .owner(user)
                .name("Persistence Test Company")
                .country("Cambodia")
                .city("Phnom Penh")
                .verificationStatus("PENDING")
                .build());

        Product product = productRepository.save(Product.builder()
                .company(company)
                .categoryId(1L)
                .name("Persistence Test Product")
                .price(new BigDecimal("12.50"))
                .stockQuantity(10)
                .active(true)
                .build());

        assertThat(product.getId()).isNotNull();
        assertThat(productRepository.findById(product.getId())).isPresent();
    }
}
