package com.ecommerce.Shopping_Cart.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.Shopping_Cart.Service.ProductService;
import com.ecommerce.Shopping_Cart.DTO.ProductDto;
import com.ecommerce.Shopping_Cart.Entity.Product;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Add new product (POST)
    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody ProductDto productDto) {
        Product product = new Product();
        product.setId(null);
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setImageUrl(productDto.getImageUrl()); // ✅ new line
        product.setCreatedAt(java.time.LocalDateTime.now());
        
       Product savedProduct= productService.addProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    // Get all products (GET)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}

