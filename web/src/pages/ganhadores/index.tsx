import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import RafflesList from "@/components/common/raffles-list";
import { useGetAllRaffles } from "@/hooks/common/use-get-all-raffles.hook";
import { Skeleton } from "@nextui-org/skeleton";

export default function Home() {
  const { raffles, isLoading } = useGetAllRaffles({
    status: RaffleStatus.FINISHED,
  });
  return (
    <Skeleton isLoaded={!isLoading} className="rounded-xl">
      <div className="space-y-4 my-8 h-full w-full flex flex-col justify-center items-center">
        {raffles && <RafflesList raffles={raffles} />}
      </div>
    </Skeleton>
  );
}
