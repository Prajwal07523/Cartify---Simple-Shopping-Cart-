package com.ecommerce.Shopping_Cart.Service;

import java.util.List;

import com.ecommerce.Shopping_Cart.DTO.OrderDetailDto;
import com.ecommerce.Shopping_Cart.DTO.OrderResponseDto;
import com.ecommerce.Shopping_Cart.Entity.Order;
import com.ecommerce.Shopping_Cart.Entity.Product;
import com.ecommerce.Shopping_Cart.Entity.User;

public interface OrderService {
	public OrderResponseDto buyNow(String username, Long productId, int quantity);
	public OrderResponseDto checkout(String username);
	List<OrderDetailDto> getOrdersByUsername(String username);

}
