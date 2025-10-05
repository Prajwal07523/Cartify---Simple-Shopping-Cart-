package com.ecommerce.Shopping_Cart.DTO;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderResponseDto {
    private Long orderId;
    private Long cartId;     
    private Long userId;
    private String status;

}

