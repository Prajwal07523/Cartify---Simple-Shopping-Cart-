package com.ecommerce.Shopping_Cart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.Shopping_Cart.Entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem,Long>{

}
