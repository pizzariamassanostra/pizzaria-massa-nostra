// ===========================================
// NOTIFICATION GATEWAY
// WebSocket Gateway para notificações em tempo real
// Permite comunicação bidirecional entre servidor e clientes
// ===========================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * Gateway WebSocket para notificações em tempo real
 * Gerencia conexões de clientes e emite eventos
 */
@WebSocketGateway({
  cors: {
    origin: '*', // Em produção, especificar origem correta
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // Servidor WebSocket
  @WebSocketServer()
  server: Server;

  // Logger para rastreamento
  private readonly logger = new Logger(NotificationGateway.name);

  // Mapa de clientes conectados (ID do socket -> Socket)
  private clients: Map<string, Socket> = new Map();

  /**
   * Evento de conexão de novo cliente
   * @param client - Socket do cliente
   */
  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.clients.set(client.id, client);

    // Log do total de clientes conectados
    this.logger.log(`Total de clientes conectados: ${this.clients.size}`);
  }

  /**
   * Evento de desconexão de cliente
   * @param client - Socket do cliente
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.clients.delete(client.id);

    // Log do total de clientes restantes
    this.logger.log(`Total de clientes conectados: ${this.clients.size}`);
  }

  /**
   * Notificar todos os administradores sobre novo pedido
   * Emite evento 'new_order' para todos os clientes conectados
   *
   * @param orderId - ID do pedido
   * @param orderData - Dados adicionais do pedido
   */
  notifyNewOrder(orderId: number, orderData?: any) {
    this.logger.log(`Notificando novo pedido #${orderId}`);

    this.server.emit('new_order', {
      orderId,
      message: `Novo pedido #${orderId} recebido!`,
      timestamp: new Date().toISOString(),
      data: orderData,
    });
  }

  /**
   * Notificar cliente específico sobre mudança de status
   * Emite evento para room específica do pedido
   *
   * @param orderId - ID do pedido
   * @param newStatus - Novo status
   * @param message - Mensagem adicional
   */
  notifyOrderStatusChange(
    orderId: number,
    newStatus: string,
    message?: string,
  ) {
    this.logger.log(`Pedido #${orderId} - Novo status: ${newStatus}`);

    // Emitir para todos os clientes (filtrar no frontend)
    this.server.emit(`order_${orderId}_status`, {
      orderId,
      status: newStatus,
      message: message || `Pedido #${orderId} atualizado para: ${newStatus}`,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Notificar sobre pagamento aprovado
   * Emite evento específico de pagamento
   *
   * @param orderId - ID do pedido
   * @param paymentData - Dados do pagamento
   */
  notifyPaymentApproved(orderId: number, paymentData?: any) {
    this.logger.log(`Pagamento aprovado - Pedido #${orderId}`);

    this.server.emit(`order_${orderId}_payment`, {
      orderId,
      status: 'approved',
      message: `Pagamento do pedido #${orderId} aprovado!`,
      timestamp: new Date().toISOString(),
      data: paymentData,
    });
  }

  /**
   * Broadcast genérico para todos os clientes
   *
   * @param event - Nome do evento
   * @param data - Dados a serem enviados
   */
  broadcast(event: string, data: any) {
    this.logger.log(`Broadcast: ${event}`);
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Obter quantidade de clientes conectados
   * @returns number
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }
}
