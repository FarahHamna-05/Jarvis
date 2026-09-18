import { Client } from '@stomp/stompjs';

export const createWebSocketClient = (onRiskUpdate) => {
  const client = new Client({
    brokerURL: 'ws://localhost:8085/ws',
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('[WebSocket] Connected to SupplyGuard STOMP Broker');
      client.subscribe('/topic/risks', (message) => {
        if (message.body) {
          try {
            const riskEvent = JSON.parse(message.body);
            console.log('[WebSocket] Real-time Risk Event Received:', riskEvent);
            if (onRiskUpdate) {
              onRiskUpdate(riskEvent);
            }
          } catch (err) {
            console.error('[WebSocket] Error parsing risk update:', err);
          }
        }
      });
    },
    onStompError: (frame) => {
      console.warn('[WebSocket] STOMP Broker reported error:', frame.headers['message']);
    },
    onWebSocketClose: () => {
      console.log('[WebSocket] Connection closed, will retry...');
    }
  });

  return client;
};
