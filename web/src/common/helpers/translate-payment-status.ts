import { PaymentStatus } from "../enum/payment-status.enum";

export default function translatePaymentStatus(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.PENDING:
      return "Pendente";
    case PaymentStatus.SUCCESS:
      return "Pago";
    case PaymentStatus.FAILED:
      return "Expirado";
    default:
      return "Desconhecido";
  }
}
