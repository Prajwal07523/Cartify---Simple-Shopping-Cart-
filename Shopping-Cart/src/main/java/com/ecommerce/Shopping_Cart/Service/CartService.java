package com.ecommerce.Shopping_Cart.Service;

import com.ecommerce.Shopping_Cart.DTO.AddToCartDto;
import com.ecommerce.Shopping_Cart.DTO.CartResponseDto;

public interface CartService {
	  
	  public CartResponseDto getCart(String username) ;
	public void addToCart(String username, AddToCartDto dto);
	public void removeFromCart(String username, Long productId);
	public void clearCart(String username);
	  
}
