package com.fintrack.khmtomnenh.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import com.fintrack.khmtomnenh.category.entity.Category;
import com.fintrack.khmtomnenh.category.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void rejectsProtectedEndpointWithoutToken() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registersLogsInAndAccessesProtectedEndpoint() throws Exception {
        String email = "security-" + UUID.randomUUID() + "@example.com";
        String password = "password123";
        String registration = """
                {
                  "fullName": "Security Test",
                  "email": "%s",
                  "mobileNumber": "0123456789",
                  "password": "%s",
                  "role": "BUYER"
                }
                """.formatted(email, password);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registration))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.role").value("BUYER"));

        String login = """
                {
                  "email": "%s",
                  "password": "%s"
                }
                """.formatted(email, password);

        String token = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(login))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andReturn()
                .getResponse()
                .getContentAsString()
                .replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(get("/api/products")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void deniesBuyerAdminOnlyOperation() throws Exception {
        String email = "buyer-" + UUID.randomUUID() + "@example.com";
        String registration = """
                {
                  "fullName": "Buyer Test",
                  "email": "%s",
                  "mobileNumber": "0123456789",
                  "password": "password123",
                  "role": "BUYER"
                }
                """.formatted(email);

        String token = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registration))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString()
                .replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(post("/api/categories")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Buyer Cannot Create","description":"security test"}
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void completesSupplierToOrderWorkflow() throws Exception {
        String suffix = UUID.randomUUID().toString();
        String supplierToken = register("supplier-" + suffix + "@example.com", "SUPPLIER");
        String buyerToken = register("buyer-" + suffix + "@example.com", "BUYER");
        String unrelatedToken = register("unrelated-" + suffix + "@example.com", "BUYER");
        Category category = categoryRepository.save(Category.builder()
                .name("Workflow-" + suffix)
                .description("Workflow test category")
                .build());

        String company = mockMvc.perform(post("/api/companies")
                        .header("Authorization", "Bearer " + supplierToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Workflow Supplier",
                                  "description": "Supplier profile",
                                  "email": "supplier@example.com",
                                  "phone": "0123456789",
                                  "address": "1 Market Street",
                                  "website": "https://supplier.example.com",
                                  "businessType": "Agriculture",
                                  "country": "Cambodia",
                                  "city": "Phnom Penh"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.website").value("https://supplier.example.com"))
                .andExpect(jsonPath("$.businessType").value("Agriculture"))
                .andReturn().getResponse().getContentAsString();
        long companyId = idFrom(company);

        String product = mockMvc.perform(post("/api/products")
                        .header("Authorization", "Bearer " + supplierToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "companyId": %d,
                                  "categoryId": %d,
                                  "name": "Workflow Pepper",
                                  "description": "Test product",
                                  "price": 12.50,
                                  "stockQuantity": 100
                                }
                                """.formatted(companyId, category.getId())))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long productId = idFrom(product);

        mockMvc.perform(get("/api/products/" + productId)
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company.name").value("Workflow Supplier"));

        String rfq = mockMvc.perform(post("/api/rfqs")
                        .header("Authorization", "Bearer " + buyerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Workflow quote request",
                                  "description": "Deliver to Phnom Penh",
                                  "items": [{"productId": %d, "quantity": 4}]
                                }
                                """.formatted(productId)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long rfqId = idFrom(rfq);

        mockMvc.perform(get("/api/rfqs/open")
                        .header("Authorization", "Bearer " + supplierToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(rfqId));

        String quotation = mockMvc.perform(post("/api/quotations")
                        .header("Authorization", "Bearer " + supplierToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "rfqId": %d,
                                  "notes": "Includes delivery",
                                  "shippingCost": 5.00,
                                  "deliveryDate": "2030-01-15",
                                  "items": [{"productId": %d, "quantity": 4, "unitPrice": 10.00}]
                                }
                                """.formatted(rfqId, productId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalAmount").value(45.0))
                .andExpect(jsonPath("$.shippingCost").value(5.0))
                .andReturn().getResponse().getContentAsString();
        long quotationId = idFrom(quotation);

        mockMvc.perform(get("/api/quotations/" + quotationId)
                        .header("Authorization", "Bearer " + unrelatedToken))
                .andExpect(status().isForbidden());

        String order = mockMvc.perform(post("/api/orders/accept/" + quotationId)
                        .header("Authorization", "Bearer " + buyerToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalAmount").value(45.0))
                .andReturn().getResponse().getContentAsString();
        long orderId = idFrom(order);

        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + unrelatedToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(patch("/api/orders/" + orderId + "/status")
                        .header("Authorization", "Bearer " + supplierToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    private String register(String email, String role) throws Exception {
        String body = """
                {
                  "fullName": "Workflow User",
                  "email": "%s",
                  "mobileNumber": "0123456789",
                  "password": "password123",
                  "role": "%s"
                }
                """.formatted(email, role);
        return mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString()
                .replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }

    private long idFrom(String value) {
        return Long.parseLong(value.replaceAll(".*\"id\":([0-9]+).*", "$1"));
    }
}
