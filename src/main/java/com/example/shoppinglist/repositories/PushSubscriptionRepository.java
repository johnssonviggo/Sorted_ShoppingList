package com.example.shoppinglist.repositories;

import com.example.shoppinglist.models.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    List<PushSubscription> findAll();
}