package com.ecommerce.Shopping_Cart.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.Shopping_Cart.Entity.Product;

public interface ProductService {
	 public Product addProduct(Product product);
	 public List<Product> getAllProducts();
	 public Product getProductById(Long id);
}
