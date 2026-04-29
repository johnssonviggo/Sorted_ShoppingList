package com.example.shoppinglist.controllers;

import com.example.shoppinglist.models.PushSubscription;
import com.example.shoppinglist.models.PushSubscriptionRequest;
import com.example.shoppinglist.repositories.PushSubscriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/notifications")
public class NotificationController {

    private final PushSubscriptionRepository repository;

    public NotificationController(PushSubscriptionRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody PushSubscriptionRequest request) {
        PushSubscription sub = new PushSubscription();
        sub.setEndpoint(request.getSubscription().getEndpoint());
        sub.setP256dh(request.getSubscription().getKeys().getP256dh());
        sub.setAuth(request.getSubscription().getKeys().getAuth());
        repository.save(sub);
        return ResponseEntity.ok().build();
    }
}