package com.example.shoppinglist.controllers;

import com.example.shoppinglist.config.JwtUtil;
import com.example.shoppinglist.repositories.PushSubscriptionRepository;
import com.example.shoppinglist.repositories.UserRepository;
import com.example.shoppinglist.services.PushNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.shoppinglist.models.User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PushNotificationService pushNotificationService;
    private final PushSubscriptionRepository pushSubscriptionRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          PushNotificationService pushNotificationService,
                          PushSubscriptionRepository pushSubscriptionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.pushNotificationService = pushNotificationService;
        this.pushSubscriptionRepository = pushSubscriptionRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User(username, passwordEncoder.encode(password));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        pushNotificationService.sendToAll(
                pushSubscriptionRepository.findAll(),
                "New Login",
                username + "Has logged in"
        );

        String token = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", token, "username", username));
    }
}
