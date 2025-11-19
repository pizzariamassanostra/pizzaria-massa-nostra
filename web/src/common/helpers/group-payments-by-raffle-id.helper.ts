import { Payment } from "../interfaces/payments.interface";

export const groupPaymentsByRaffleId = (payments?: Payment[]) => {
  if (!payments) return;
  const formattedPayments: { payments: Payment[]; raffle_id: string }[] = [];

  payments.forEach((payment) => {
    const alreadyExists = formattedPayments.find(
      (obj) => obj.raffle_id === payment.raffle_id,
    );
    if (alreadyExists) {
      alreadyExists.payments.push(payment);
    } else {
      formattedPayments.push({
        payments: [payment],
        raffle_id: payment.raffle_id,
      });
    }
  });
  return formattedPayments;
};
