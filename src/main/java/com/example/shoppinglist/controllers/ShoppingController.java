package com.example.shoppinglist.controllers;

import com.example.shoppinglist.models.ShoppingItem;
import com.example.shoppinglist.models.ShoppingItemRequest;
import com.example.shoppinglist.repositories.ShoppingItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/shopping")
public class ShoppingController {

    private final ShoppingItemRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public ShoppingController(ShoppingItemRepository repository,
                              SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public List<ShoppingItem> getItems() {
        return repository.findAll();
    }

    @PostMapping
    public ShoppingItem addItem(@RequestBody ShoppingItemRequest request) {
        List<ShoppingItem> existing = repository.findByTextIgnoreCaseAndTag(
                request.getText(), request.getTag()
        );

        if (!existing.isEmpty()) {
            ShoppingItem item = existing.getFirst();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            ShoppingItem updated = repository.save(item);
            messagingTemplate.convertAndSend("/topic/shopping", "refresh");
            return updated;
        }

        ShoppingItem item = new ShoppingItem(
                request.getText(),
                request.getTag(),
                request.getQuantity()
        );


        ShoppingItem saved = repository.save(item);
        messagingTemplate.convertAndSend("/topic/shopping", "refresh");
        return saved;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ShoppingItem> updateItem(@PathVariable Long id, @RequestBody ShoppingItemRequest request) {
        return repository.findById(id)
                .map(item -> {
                    if (request.getText() != null) item.setText(request.getText());
                    if (request.getTag() != null) item.setTag(request.getTag());
                    if (request.getComplete() != null) item.setComplete(request.getComplete());
                    if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
                    ShoppingItem updated = repository.save(item);
                    messagingTemplate.convertAndSend("/topic/shopping", "refresh");
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/shopping", "refresh");
        return ResponseEntity.noContent().build();
    }
}