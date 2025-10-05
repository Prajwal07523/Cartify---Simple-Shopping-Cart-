package com.ecommerce.Shopping_Cart.config;


import com.ecommerce.Shopping_Cart.DTO.ProductDto;
import com.ecommerce.Shopping_Cart.Entity.Product;
import com.ecommerce.Shopping_Cart.Service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final ProductService productService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        try {
            InputStream inputStream = getClass().getResourceAsStream("/products.json");
            if (inputStream == null) {
                System.err.println("❌ products.json not found in resources folder.");
                return;
            }

            List<ProductDto> productDtos = objectMapper.readValue(inputStream, new TypeReference<>() {});
            System.out.println("✅ Loading " + productDtos.size() + " products into database...");

            for (ProductDto dto : productDtos) {
                Product product = new Product();
                product.setName(dto.getName());
                product.setDescription(dto.getDescription());
                product.setPrice(BigDecimal.valueOf(dto.getPrice().doubleValue()));
                product.setStockQuantity(dto.getStockQuantity());
                product.setImageUrl(dto.getImageUrl()); // ✅ image URL
                product.setCreatedAt(java.time.LocalDateTime.now());
                productService.addProduct(product);
            }

            System.out.println("✅ Product data initialized successfully.");
        } catch (Exception e) {
            System.err.println("❌ Failed to initialize product data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

