import { RaffleStatus } from "../enum/raffle-status.enum";

export default function translateRaffleStatus(status: RaffleStatus): string {
  switch (status) {
    case RaffleStatus.OPEN:
      return "Rifa aberta";
    case RaffleStatus.FINISHED:
      return "Rifa finalizada";
    case RaffleStatus.CANCELLED:
      return "Rifa cancelada";
    default:
      return "Desconhecido";
  }
}
