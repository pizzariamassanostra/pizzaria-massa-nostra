// ============================================
// GATEWAY: WEBSOCKET NOTIFICAÇÕES
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Mapa de clientes conectados
  private clients: Map<string, Socket> = new Map();

  // ============================================
  // CONEXÃO
  // ============================================
  handleConnection(client: Socket) {
    console.log(`🔌 Cliente conectado: ${client.id}`);
    this.clients.set(client.id, client);
  }

  // ============================================
  // DESCONEXÃO
  // ============================================
  handleDisconnect(client: Socket) {
    console.log(`🔌 Cliente desconectado: ${client.id}`);
    this.clients.delete(client.id);
  }

  // ============================================
  // NOTIFICAR NOVO PEDIDO (ADMIN)
  // ============================================
  notifyNewOrder(orderId: number) {
    this.server.emit('new_order', {
      orderId,
      message: `Novo pedido #${orderId} recebido!`,
      timestamp: new Date(),
    });
  }

  // ============================================
  // NOTIFICAR MUDANÇA DE STATUS (CLIENTE)
  // ============================================
  notifyOrderStatusChange(orderId: number, newStatus: string) {
    this.server.emit(`order_${orderId}_status`, {
      orderId,
      status: newStatus,
      message: `Pedido #${orderId}: ${newStatus}`,
      timestamp: new Date(),
    });
  }

  // ============================================
  // NOTIFICAR PAGAMENTO APROVADO
  // ============================================
  notifyPaymentApproved(orderId: number) {
    this.server.emit(`order_${orderId}_payment`, {
      orderId,
      status: 'approved',
      message: `Pagamento do pedido #${orderId} aprovado!`,
      timestamp: new Date(),
    });
  }
}


