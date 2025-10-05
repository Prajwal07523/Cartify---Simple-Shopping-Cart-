package com.ecommerce.Shopping_Cart.Controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.Shopping_Cart.DTO.UserLoginDto;
import com.ecommerce.Shopping_Cart.DTO.UserRegistrationDto;
import com.ecommerce.Shopping_Cart.Service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody UserRegistrationDto userDto) {
        String message = authService.register(userDto);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);  // Wrap the string in a JSON object
        return ResponseEntity.ok(response);
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto) {
        try {
            String token = authService.login(userLoginDto);
            // Wrap token in JSON for easier frontend handling
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            // Return 404 if user not found, 403 if invalid credentials
            String msg = e.getMessage();
            HttpStatus status = msg.equals("User not found") ? HttpStatus.NOT_FOUND : HttpStatus.FORBIDDEN;
            return ResponseEntity.status(status).body(Map.of("message", msg));
        }
    }


}

