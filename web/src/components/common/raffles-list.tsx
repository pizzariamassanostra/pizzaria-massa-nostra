import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import { Raffle } from "@/common/interfaces/raffles.interface";
import OpenRaffleCard from "./open-raffle-card";
import FinishedRaffleCard from "./finished-raffles-card";
import { useRouter } from "next/router";

export default function RafflesList({
  raffles,
  canBuy = true,
}: {
  raffles: Raffle[];
  canBuy?: boolean;
}) {
  const openRaffles = raffles.filter(
    (raffle) => raffle.status === RaffleStatus.OPEN,
  );
  const finishedRaffles = raffles.filter(
    (raffle) => raffle.status === RaffleStatus.FINISHED,
  );

  const router = useRouter();
  const handleClick = (raffleId: string) => {
    router.push(`/rifas/${raffleId}?compra-rapida=true`);
  };
  return (
    <div className="space-y-4 h-full w-full ">
      {openRaffles?.map((raffle) => (
        <OpenRaffleCard
          key={raffle.id}
          raffle={raffle}
          onClick={(id: string) => handleClick(id)}
          canBuy={canBuy}
        />
      ))}
      {finishedRaffles?.map((raffle) => (
        <FinishedRaffleCard
          key={raffle.id}
          raffle={raffle}
          onClick={(id: string) => handleClick(id)}
        />
      ))}
    </div>
  );
}
