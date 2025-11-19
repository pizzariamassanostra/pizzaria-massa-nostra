import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import RafflesList from "@/components/common/raffles-list";
import { useGetAllRaffles } from "@/hooks/common/use-get-all-raffles.hook";
import { Skeleton } from "@nextui-org/skeleton";

export default function RafflesPage() {
  const { raffles, isLoading: isLoadingOpenRaffles } = useGetAllRaffles();

  const openRaffles = raffles?.filter(
    (raffle) => raffle.status === RaffleStatus.OPEN,
  );
  const finishedRaffles = raffles?.filter(
    (raffle) => raffle.status === RaffleStatus.FINISHED,
  );
  return (
    <Skeleton isLoaded={!isLoadingOpenRaffles} className="rounded-xl">
      <div className="space-y-4">
        {(openRaffles || finishedRaffles) && (
          <RafflesList
            raffles={[...(openRaffles ?? []), ...(finishedRaffles ?? [])]}
          />
        )}
      </div>
    </Skeleton>
  );
}
