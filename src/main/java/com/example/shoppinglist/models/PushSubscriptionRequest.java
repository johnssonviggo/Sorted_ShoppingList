package com.example.shoppinglist.models;


import lombok.Data;

import java.util.concurrent.Flow;

@Data
public class PushSubscriptionRequest {
    private String userId;
    private SubscriptionKeys subscription;

    @Data
    public static class SubscriptionKeys {
        private String endpoint;
        private Keys keys;
    }

    @Data
    public static class Keys {
        private String p256dh;
        private String auth;
    }
}