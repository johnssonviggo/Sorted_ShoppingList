import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {

    private client: Client;
    public updates$ = new Subject<void>();

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(`http://${window.location.hostname}:8080/ws`),
            reconnectDelay: 5000,
            onConnect: () => {
                this.client.subscribe('/topic/shopping', () => {
                    this.updates$.next();
                });
            }
        });
        this.client.activate();
    }
}