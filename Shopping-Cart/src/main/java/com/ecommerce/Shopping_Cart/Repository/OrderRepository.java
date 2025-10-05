package com.ecommerce.Shopping_Cart.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.Shopping_Cart.Entity.Order;
import com.ecommerce.Shopping_Cart.Entity.User;
@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

	List<Order> findByUserOrderByOrderDateDesc(User user);

}
