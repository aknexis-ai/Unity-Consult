import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.APP_ORIGIN ?? "http://127.0.0.1:3000",
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage("admin:subscribe")
  handleAdminSubscribe(@ConnectedSocket() client: Socket, @MessageBody() payload: { room?: string }) {
    const room = payload.room ?? "admin:global";
    client.join(room);

    return { event: "admin:subscribed", data: { room } };
  }

  emitLeadStageChanged(payload: Record<string, unknown>) {
    this.server.to("admin:global").emit("lead:stage-changed", payload);
  }

  emitOrderUpdated(payload: Record<string, unknown>) {
    this.server.to("admin:global").emit("order:updated", payload);
  }

  emitTicketUpdated(payload: Record<string, unknown>) {
    this.server.to("admin:global").emit("ticket:updated", payload);
  }

  emitPaymentUpdated(payload: Record<string, unknown>) {
    this.server.to("admin:global").emit("payment:updated", payload);
  }
}
