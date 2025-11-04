package com.ecommerce.Shopping_Cart.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import com.ecommerce.Shopping_Cart.filter.JwtFilter;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Autowired
//     private JwtFilter jwtFilter;

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf().disable()
//             .cors() // ✅ enable CORS inside Spring Security
//             .and()
//             .authorizeHttpRequests()
//             .requestMatchers("/auth/**").permitAll()  
//             .requestMatchers("/products/**").permitAll()
//             .requestMatchers("/cart/**").authenticated()
//             .requestMatchers("/orders/**").authenticated()
//             .anyRequest().authenticated()
//             .and()
//             .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

//         http.formLogin().disable();
//         http.httpBasic().disable();

//         http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

//         return http.build();
//     }


// }

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))  // ✅ enable CORS inside security
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()  // ✅ allow login/register
                .requestMatchers("/products/**").permitAll()  // ✅ allow products
                .requestMatchers("/cart/**", "/orders/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}


