package com.example.shoppinglist.services;

import com.example.shoppinglist.models.PushSubscription;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.util.List;

@Service
public class PushNotificationService {

    private final PushService pushService;

    public PushNotificationService(
            @Value("${vapid.public.key}") String publicKey,
            @Value("${vapid.private.key}") String privateKey,
            @Value("${vapid.subject}") String subject
    ) throws Exception {
        Security.addProvider(new BouncyCastleProvider());
        this.pushService = new PushService(publicKey, privateKey, subject);
    }

    public void sendToAll(List<PushSubscription> subscriptions, String title, String body) {
        for (PushSubscription sub : subscriptions) {
            try {
                byte[] p256dh = java.util.Base64.getUrlDecoder().decode(sub.getP256dh());
                byte[] auth   = java.util.Base64.getUrlDecoder().decode(sub.getAuth());

                String payload = String.format(
                        "{\"title\":\"%s\",\"body\":\"%s\",\"url\":\"/\"}",
                        title, body
                );

                Notification notification = Notification.builder()
                        .endpoint(sub.getEndpoint())
                        .userPublicKey(p256dh)
                        .userAuth(auth)
                        .payload(payload)
                        .build();

                pushService.send(notification);
            } catch (Exception e) {
                System.err.println("Failed to send push to: " + sub.getEndpoint());
                e.printStackTrace();
            }
        }
    }
}