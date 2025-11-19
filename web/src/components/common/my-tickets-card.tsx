import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import { Payment } from "@/common/interfaces/payments.interface";
import { useGetOneRaffle } from "@/hooks/common/use-get-one-raffle.hook";
import { Skeleton } from "@nextui-org/skeleton";
import FinishedRaffleCard from "./finished-raffles-card";
import OpenRaffleCard from "./open-raffle-card";
import PaymentCard from "./payment-card";
import { useRouter } from "next/router";

export default function MyTicketsCard({
  raffle_id,
  payments,
}: {
  raffle_id: string;
  payments: Payment[];
}) {
  const router = useRouter();
  const { raffle, isLoading } = useGetOneRaffle(raffle_id);
  const handleClick = (raffleId: string) => {
    router.push(`/rifas/${raffleId}?compra-rapida=true`);
  };
  return (
    <Skeleton isLoaded={!isLoading} className="rounded-xl w-full">
      <div className="space-y-4">
        {raffle?.status === RaffleStatus.FINISHED ? (
          <FinishedRaffleCard
            raffle={raffle}
            onClick={(id: string) => handleClick(id)}
          />
        ) : raffle?.status === RaffleStatus.OPEN ? (
          <OpenRaffleCard
            onClick={(id: string) => handleClick(id)}
            raffle={raffle}
            canBuy={true}
          />
        ) : null}
        {payments?.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} raffle={raffle} />
        ))}
      </div>
    </Skeleton>
  );
}
