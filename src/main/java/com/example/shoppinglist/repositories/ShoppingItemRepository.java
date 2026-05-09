package com.example.shoppinglist.repositories;

import com.example.shoppinglist.models.ShoppingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    List<ShoppingItem> findByTextIgnoreCaseAndTag(String text, String tag);
}