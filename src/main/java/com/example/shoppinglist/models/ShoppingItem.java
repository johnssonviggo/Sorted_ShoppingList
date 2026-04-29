package com.example.shoppinglist.models;


import jakarta.persistence.*;
import lombok.*;


@Data
@NoArgsConstructor
@Entity
@Table(name = "shopping_items")
public class ShoppingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private boolean complete = false;

    @Column
    private String tag;

    @Column
    private Integer quantity = 1;

    public ShoppingItem(String text, String tag, Integer quantity) {
        this.text = text;
        this.tag = tag;
        this.quantity = quantity != null ? quantity : 1;
    }
}