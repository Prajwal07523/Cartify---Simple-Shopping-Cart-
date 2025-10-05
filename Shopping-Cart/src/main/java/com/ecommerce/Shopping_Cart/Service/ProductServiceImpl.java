package com.ecommerce.Shopping_Cart.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.Shopping_Cart.Entity.Product;
import com.ecommerce.Shopping_Cart.Repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService{
	
	 @Autowired
	    private ProductRepository productRepository;
         
	 @Override
	    public Product addProduct(Product product) {
	        return productRepository.save(product);
	    }
	 
	 @Override
	    public List<Product> getAllProducts() {
	        return productRepository.findAll();
	    }
	 
	 @Override
	    public Product getProductById(Long id) {
	        return productRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Product not found"));
	    }

		
}
