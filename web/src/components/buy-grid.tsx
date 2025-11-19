import { Raffle } from "@/common/interfaces/raffles.interface";
import { InputMask } from "@react-input/mask";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { CircleDollarSign, CircleMinus, CirclePlus } from "lucide-react";
import { useState } from "react";
import currencyFormatter from "@/lib/currency-formatter";

export default function BuyGrid({
  raffle,
  onBuyCallback,
}: {
  raffle: Raffle;
  onBuyCallback: (qtd: number) => void;
}) {
  const options = [5, 10, 50, 100, 500, 1000];
  const [quantity, setQuantity] = useState(raffle.min_quantity);

  const handleQuantityChange = (value: number) => {
    if (value > 99999) return;
    setQuantity(value);
  };

  const handleInputQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value);
    handleQuantityChange(isNaN(value) ? 0 : value);
  };

  return (
    <div className="bg-black/65 rounded-xl">
      <Card isBlurred className="p-8 space-y-4">
        <span className="text-xl text-center">
          Adicione quantidades fixas ou uma por uma se preferir!
        </span>
        <span className="text-center">
          Compra mínima desta ação: {raffle.min_quantity} cotas
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {options.map((option) => (
            <Button
              key={option}
              variant="solid"
              className="flex bg-black p-6 text-white rounded-2xl m-2 flex-col items-center justify-center space-y-2 py-8 border-2 border-yellow-500"
              onClick={() => handleQuantityChange(option + quantity)}
            >
              <span className="font-bold text-lg uppercase">
                + {option} cota{option > 1 ? "s" : ""}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <span>Você está comprando</span>
          <div className="flex w-full flex-col items-center mb-6">
            <div className="w-full flex flex-row my-4 space-x-2 items-center">
              <CircleMinus
                className="cursor-pointer h-full w-12"
                onClick={() => handleQuantityChange(quantity - 1)}
              />
              <InputMask
                value={quantity}
                onChange={handleInputQuantityChange}
                mask="_____"
                showMask={false}
                className="bg-green-800 w-full py-2 rounded-xl text-center text-xl"
                replacement={{ _: /\d/ }}
              />
              <CirclePlus
                className="cursor-pointer h-full w-12"
                onClick={() => handleQuantityChange(quantity + 1)}
              />
            </div>
            <span className="bg-green-800 rounded-xl w-full p-4 flex flex-row justify-between items-center">
              <div className="space-x-1 flex font-bold flex-row">
                <CircleDollarSign color="yellow" />
                <span> Quero participar</span>
              </div>
              <span>
                {currencyFormatter.format(quantity * raffle.price_number)}
              </span>
            </span>
          </div>
          <Button
            variant="ghost"
            color="success"
            className="font-bold uppercase animate-pulse"
            onClick={() => onBuyCallback(quantity)}
          >
            Finalizar Compra!
          </Button>
        </div>
      </Card>
    </div>
  );
}
