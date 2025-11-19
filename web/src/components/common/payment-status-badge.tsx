import { PaymentStatus } from "@/common/enum/payment-status.enum";
import translatePaymentStatus from "@/common/helpers/translate-payment-status";

export default function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  let color;
  switch (status) {
    case PaymentStatus.SUCCESS:
      color = "bg-green-800";
      break;
    case PaymentStatus.PENDING:
      color = "bg-yellow-800";
      break;
    case PaymentStatus.FAILED:
      color = "bg-red-800";
      break;
    default:
      color = "bg-yellow-800";
      break;
  }
  return (
    <span
      className={`${color} w-min text-nowrap text-tiny text-white px-2 py-1 uppercase rounded-full`}
    >
      {translatePaymentStatus(status)}
    </span>
  );
}
