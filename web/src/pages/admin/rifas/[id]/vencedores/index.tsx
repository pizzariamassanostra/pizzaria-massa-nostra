import { Raffle } from "@/common/interfaces/raffles.interface";
import GiftWinnerCard from "@/components/common/gift-winner-card";
import WinnersContainer from "@/components/winners-container";
import { useGetRaffleWinners } from "@/hooks/admin/use-get-winners.hook";
import { useParams } from "next/navigation";

export default function WinnersPage() {
  const params = useParams();
  const { winner, giftWinners } = useGetRaffleWinners(
    params?.id ? (params.id as string) : "",
  );

  return (
    <div className="bg-black/65 w-full">
      {winner && (
        <WinnersContainer
          censor={false}
          raffle={
            {
              prize_number: winner?.number,
              winner_common_user: winner?.common_user,
            } as Raffle
          }
        />
      )}

      {giftWinners &&
        giftWinners.map((giftWinner) => (
          <GiftWinnerCard
            censor={false}
            key={giftWinner.id}
            userRaffleNumber={giftWinner}
          />
        ))}
    </div>
  );
}
