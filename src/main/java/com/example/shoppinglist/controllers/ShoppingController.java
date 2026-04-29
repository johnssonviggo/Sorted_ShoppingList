package com.example.shoppinglist.controllers;

import com.example.shoppinglist.models.ShoppingItem;
import com.example.shoppinglist.models.ShoppingItemRequest;
import com.example.shoppinglist.repositories.ShoppingItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/shopping")
public class ShoppingController {

    private final ShoppingItemRepository repository;

    public ShoppingController(ShoppingItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ShoppingItem> getItems() {
        return repository.findAll();
    }

    @PostMapping
    public ShoppingItem addItem(@RequestBody ShoppingItemRequest request) {
        ShoppingItem item = new ShoppingItem(
                request.getText(),
                request.getTag(),
                request.getQuantity()
        );
        return repository.save(item);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ShoppingItem> updateItem(@PathVariable Long id, @RequestBody ShoppingItemRequest request) {
        return repository.findById(id)
                .map(item -> {
                    if (request.getText() != null) item.setText(request.getText());
                    if (request.getTag() != null) item.setTag(request.getTag());
                    if (request.getComplete() != null) item.setComplete(request.getComplete());
                    if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
                    return ResponseEntity.ok(repository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}