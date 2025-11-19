import { censorUsername } from "@/common/helpers/censor-username";
import { Raffle } from "@/common/interfaces/raffles.interface";
import { Card } from "@nextui-org/card";

export default function WinnersContainer({
  raffle,
  censor = true,
}: {
  raffle: Raffle;
  censor?: boolean;
}) {
  return (
    <div className="bg-black/65 rounded-xl items-center">
      <Card isBlurred className="flex flex-row">
        <div className="p-2">
          <img src="/logo.svg" className="h-24 w-24" />
        </div>
        <div className="flex justify-evenly flex-col py-2 textxl">
          {raffle.winner_common_user && (
            <span>
              {censor
                ? censorUsername(raffle.winner_common_user.name).toUpperCase()
                : raffle.winner_common_user.name.toUpperCase()}
            </span>
          )}
          <span className="font-bold text-tiny md:text-medium">
            Com o número da sorte: 🎫
            {<span className="text-green-500">{raffle.prize_number}</span>}
          </span>
          {!censor && (
            <span>
              Telefone para contato: {raffle?.winner_common_user?.phone}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
