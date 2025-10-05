package com.ecommerce.Shopping_Cart.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.Shopping_Cart.DTO.AddToCartDto;
import com.ecommerce.Shopping_Cart.DTO.CartResponseDto;
import com.ecommerce.Shopping_Cart.Service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired 
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody AddToCartDto dto) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        cartService.addToCart(username, dto);
        return ResponseEntity.ok("Product added to cart");
    }

    @GetMapping
    public ResponseEntity<CartResponseDto> getCart() {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(cartService.getCart(username));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(@AuthenticationPrincipal String username) {
        cartService.clearCart(username);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    // ================= Remove single item =================
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeItem(@AuthenticationPrincipal String username,
                                             @PathVariable Long productId) {
        cartService.removeFromCart(username, productId);
        return ResponseEntity.ok("Item removed from cart");
    }

}

