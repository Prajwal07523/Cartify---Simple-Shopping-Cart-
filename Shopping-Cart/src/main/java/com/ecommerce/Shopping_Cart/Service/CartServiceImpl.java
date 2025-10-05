package com.ecommerce.Shopping_Cart.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.Shopping_Cart.DTO.AddToCartDto;
import com.ecommerce.Shopping_Cart.DTO.CartItemDto;
import com.ecommerce.Shopping_Cart.DTO.CartResponseDto;
import com.ecommerce.Shopping_Cart.Entity.Cart;
import com.ecommerce.Shopping_Cart.Entity.CartItem;
import com.ecommerce.Shopping_Cart.Entity.Product;
import com.ecommerce.Shopping_Cart.Entity.User;
import com.ecommerce.Shopping_Cart.Repository.CartItemRepository;
import com.ecommerce.Shopping_Cart.Repository.CartRepository;
import com.ecommerce.Shopping_Cart.Repository.ProductRepository;
import com.ecommerce.Shopping_Cart.Repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CartServiceImpl implements CartService{
	 @Autowired 
	 private CartRepository cartRepository;

	    @Autowired
	    private ProductRepository productRepository;
	    
	    @Autowired 
	    private UserRepository userRepository;
	    
	    @Autowired
	    private CartItemRepository cartItemRepository;

	    public void addToCart(String username, AddToCartDto addToCartDto) {
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
	            Cart newCart = new Cart();
	            newCart.setUser(user);
	            return cartRepository.save(newCart);
	        });

	        Product product = productRepository.findById(addToCartDto.getProductId())
	                .orElseThrow(() -> new RuntimeException("Product not found"));

	        CartItem item = new CartItem();
	        item.setCart(cart);
	        item.setProduct(product);
	        item.setQuantity(addToCartDto.getQuantity());
	        item.setPrice(product.getPrice().multiply(BigDecimal.valueOf(addToCartDto.getQuantity())));

	        cart.getItems().add(item);
	        cartRepository.save(cart);
	    }

	    public CartResponseDto getCart(String username) {
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Cart cart = cartRepository.findByUser(user)
	                .orElseThrow(() -> new RuntimeException("Cart not found"));

	        List<CartItemDto> items = cart.getItems().stream()
	                .map(i -> {
	                    CartItemDto dto = new CartItemDto();
	                    dto.setProductName(i.getProduct().getName());
	                    dto.setProductId(i.getProduct().getId());
	                    dto.setQuantity(i.getQuantity());
	                    dto.setPrice(i.getProduct().getPrice()
	                            .multiply(BigDecimal.valueOf(i.getQuantity())));
	                    return dto;
	                }).toList();

	        BigDecimal total = items.stream()
	                .map(CartItemDto::getPrice)
	                .reduce(BigDecimal.ZERO, BigDecimal::add);

	        CartResponseDto response = new CartResponseDto();
	        response.setItems(items);
	        response.setTotalPrice(total);

	        return response;
	    }
	    @Override
	    @Transactional
	    public void clearCart(String username) {
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Cart cart = cartRepository.findByUser(user)
	                .orElseThrow(() -> new RuntimeException("Cart not found"));

	        // Delete all CartItems from DB
	        cartItemRepository.deleteAll(cart.getItems());

	        // Clear items from cart entity
	        cart.getItems().clear();
	        cartRepository.save(cart);
	    }
	    
	    @Override
	    @Transactional
	    public void removeFromCart(String username, Long productId) {
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Cart cart = cartRepository.findByUser(user)
	                .orElseThrow(() -> new RuntimeException("Cart not found"));

	        // Remove the specific item
	        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));

	        cartRepository.save(cart);
	    }

}
