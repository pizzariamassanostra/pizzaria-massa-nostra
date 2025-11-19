import { Raffle } from "@/common/interfaces/raffles.interface";
import { Card } from "@nextui-org/card";

export default function RaffleDescription({ raffle }: { raffle: Raffle }) {
  return (
    <div className="bg-black/65 rounded-xl">
      <Card isBlurred className="flex items-center w-full flex-col">
        <span className="text-xl font-bold py-4">Descrição</span>
        <Card className=" p-8 max-h-[300px] whitespace-pre-line rounded-xl overflow-y-scroll">
          {raffle.description}
        </Card>
      </Card>
    </div>
  );
}
