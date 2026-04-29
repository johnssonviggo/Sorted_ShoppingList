package com.example.shoppinglist.models;

import lombok.Data;

@Data
public class ShoppingItemRequest {
    private String text;
    private Boolean complete;
    private String tag;
    private Integer quantity;
}