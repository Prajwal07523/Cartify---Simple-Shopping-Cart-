package com.ecommerce.Shopping_Cart.DTO;



import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
	private Long productId;
	 private String productName;
	    private int quantity;
	    private BigDecimal price;

	    public String getProductName() { return productName; }
	    public void setProductName(String productName) { this.productName = productName; }

	    public int getQuantity() { return quantity; }
	    public void setQuantity(int quantity) { this.quantity = quantity; }

	    public BigDecimal getPrice() { return price; }
	    public void setPrice(BigDecimal price) { this.price = price; }
}

