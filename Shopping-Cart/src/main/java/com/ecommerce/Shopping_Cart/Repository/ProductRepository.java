package com.ecommerce.Shopping_Cart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.Shopping_Cart.Entity.Product;

@Repository
public interface ProductRepository  extends JpaRepository<Product,Long>{

}
