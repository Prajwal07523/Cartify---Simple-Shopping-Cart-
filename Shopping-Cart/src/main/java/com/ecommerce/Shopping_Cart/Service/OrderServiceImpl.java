package com.ecommerce.Shopping_Cart.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.Shopping_Cart.DTO.OrderDetailDto;
import com.ecommerce.Shopping_Cart.DTO.OrderResponseDto;
import com.ecommerce.Shopping_Cart.Entity.Cart;
import com.ecommerce.Shopping_Cart.Entity.CartItem;
import com.ecommerce.Shopping_Cart.Entity.Order;
import com.ecommerce.Shopping_Cart.Entity.OrderItem;
import com.ecommerce.Shopping_Cart.Entity.OrderStatus;
import com.ecommerce.Shopping_Cart.Entity.Product;
import com.ecommerce.Shopping_Cart.Entity.User;
import com.ecommerce.Shopping_Cart.Repository.CartRepository;
import com.ecommerce.Shopping_Cart.Repository.OrderRepository;
import com.ecommerce.Shopping_Cart.Repository.ProductRepository;
import com.ecommerce.Shopping_Cart.Repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService{
	
	@Autowired
	private  OrderRepository orderRepository;
	
	@Autowired
    private  ProductRepository productRepository;
	
	@Autowired
    private CartRepository cartRepository;
	
	@Autowired
	private UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }
    
 // ✅ Checkout from Cart
    @Transactional
    @Override
    public OrderResponseDto checkout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // return DTO with IDs only
        OrderResponseDto dto = new OrderResponseDto();
        dto.setOrderId(savedOrder.getId());
        dto.setCartId(cart.getId());
        dto.setUserId(user.getId());
        dto.setStatus(savedOrder.getStatus().name());

        return dto;
    }

    
    


    // ✅ Buy Now (Direct Order)
    @Transactional
    @Override
    public OrderResponseDto buyNow(String username, Long productId, int quantity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Not enough stock for " + product.getName());
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(quantity);
        orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        order.setOrderItems(List.of(orderItem));

        Order savedOrder = orderRepository.save(order);

        OrderResponseDto dto = new OrderResponseDto();
        dto.setOrderId(savedOrder.getId());
        dto.setCartId(null);  // Buy Now doesn’t use cart
        dto.setUserId(user.getId());
        dto.setStatus(savedOrder.getStatus().name());

        return dto;
    }
    
    @Override
    public List<OrderDetailDto> getOrdersByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserOrderByOrderDateDesc(user);

        List<OrderDetailDto> dtoList = new ArrayList<>();

        for (Order order : orders) {
            OrderDetailDto orderDto = new OrderDetailDto();
            orderDto.setOrderId(order.getId());
            orderDto.setOrderDate(order.getOrderDate());
            orderDto.setStatus(order.getStatus().name());

            List<OrderDetailDto.OrderItemDto> itemDtos = new ArrayList<>();
            for (OrderItem item : order.getOrderItems()) {
                OrderDetailDto.OrderItemDto itemDto = new OrderDetailDto.OrderItemDto();
                itemDto.setProductName(item.getProduct().getName());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setPrice(item.getPrice());
                itemDtos.add(itemDto);
            }

            orderDto.setItems(itemDtos);
            dtoList.add(orderDto);
        }

        return dtoList;
    }



}
