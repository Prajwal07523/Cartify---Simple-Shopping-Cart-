package com.ecommerce.Shopping_Cart.Controllers;

import com.ecommerce.Shopping_Cart.DTO.OrderDetailDto;
import com.ecommerce.Shopping_Cart.DTO.OrderResponseDto;
import com.ecommerce.Shopping_Cart.Entity.Order;
import com.ecommerce.Shopping_Cart.Entity.Product;
import com.ecommerce.Shopping_Cart.Entity.User;
import com.ecommerce.Shopping_Cart.Repository.ProductRepository;
import com.ecommerce.Shopping_Cart.Service.OrderService;
import com.ecommerce.Shopping_Cart.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    
    @Autowired
    private JwtUtil jwtUtil;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public OrderResponseDto checkout(@AuthenticationPrincipal String username) {
        return orderService.checkout(username);
    }


    @PostMapping("/buyNow/{productId}")
    public OrderResponseDto buyNow(@AuthenticationPrincipal String username,
                                   @PathVariable Long productId,
                                   @RequestParam int quantity) {
        return orderService.buyNow(username, productId, quantity);
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDetailDto>> getMyOrders(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        List<OrderDetailDto> orders = orderService.getOrdersByUsername(username);
        return ResponseEntity.ok(orders);
    }



}
