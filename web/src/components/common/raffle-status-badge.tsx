import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import translateRaffleStatus from "@/common/helpers/translate-raffle-status";

export default function RaffleStatusBadge({
  status,
}: {
  status: RaffleStatus;
}) {
  let color;
  switch (status) {
    case RaffleStatus.OPEN:
      color = "bg-green-800";
      break;
    case RaffleStatus.FINISHED:
      color = "bg-red-800";
      break;
    default:
      color = "bg-green-800";
      break;
  }
  return (
    <span
      className={`${color} w-min text-nowrap text-tiny text-white px-2 py-1 uppercase rounded-full`}
    >
      {translateRaffleStatus(status)}
    </span>
  );
}
