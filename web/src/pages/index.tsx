import RafflesList from "@/components/common/raffles-list";
import { useGetAllRaffles } from "@/hooks/common/use-get-all-raffles.hook";
import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import { CircleHelp } from "lucide-react";
import { useRouter } from "next/router";

export default function Home() {
  const { raffles, isLoading } = useGetAllRaffles({ page: 1, per_page: 2 });
  const router = useRouter();
  return (
    <Skeleton isLoaded={!isLoading} className="rounded-xl">
      <div className="space-y-4">
        {raffles && <RafflesList raffles={raffles} />}
        <Button
          className="py-1 w-full text-white bg-green-800"
          size="lg"
          onClick={() => router.push("/suporte")}
        >
          <CircleHelp /> Dúvidas? Clique aqui
        </Button>
      </div>
    </Skeleton>
  );
}
