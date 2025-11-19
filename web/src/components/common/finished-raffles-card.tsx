import { Raffle } from "@/common/interfaces/raffles.interface";
import { Card, CardBody } from "@nextui-org/card";
import currencyFormatter from "@/lib/currency-formatter";
import RaffleStatusBadge from "./raffle-status-badge";
import { censorUsername } from "@/common/helpers/censor-username";

export default function FinishedRaffleCard({
  raffle,
  onClick,
}: {
  raffle: Raffle;
  onClick?: (id: string) => void;
}) {
  return (
    <div className="bg-black/65 rounded-xl">
      <Card
        className="flex flex-row bg-gray-700 rounded-xl w-full min-h-[150px]"
        isBlurred
      >
        <CardBody className="p-0 justify-start flex max-w-[45%]">
          <img
            className="w-full rounded-xl h-full object-cover flex justify-center items-center"
            src={raffle.cover_url}
          />
        </CardBody>
        <CardBody
          onClick={() => onClick?.(raffle.id)}
          className="py-4 px-2 flex items-start ms-4 space-y-4 cursor-pointer flex-col"
        >
          <p className="uppercase font-bold">Prêmio: {raffle.prize_name}</p>
          <span className="font-bold">
            {currencyFormatter.format(raffle.price_number)}/cota
          </span>
          <span className="font-bold"> 🎫{raffle.prize_number}</span>{" "}
          {raffle.winner_common_user && (
            <span className="uppercase">
              👑 {censorUsername(raffle.winner_common_user.name)}
            </span>
          )}
          <div className="flex justify-center w-full">
            <RaffleStatusBadge status={raffle.status} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
