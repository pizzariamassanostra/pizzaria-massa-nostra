import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { useMask } from "@react-input/mask";
import { toastError } from "@/lib/toastError";
import Api from "@/common/api";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface FormData {
  name: string;
  description?: string;
  prize_name: string;
  start_number: number;
  end_number: number;
  price_number: number;
  min_quantity: number;
}

export default function Home() {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      const { end_number, start_number, price_number } = data;

      if (end_number <= start_number)
        throw new Error("O número final deve ser maior que o número inicial");
      if (end_number == 0) throw new Error("O número final não pode ser 0");
      if (price_number == 0) throw new Error("O preço da cota não pode ser 0");

      await Api.post("/raffles/create", data);
      toast.success("Rifa criada com sucesso");
      router.push("/admin");
    } catch (error) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  }
  const numberRef = useMask({ mask: "_______", replacement: { _: /\d/ } });
  const moneyInputRef = useMask({
    mask: "R$_,__",
    replacement: { _: /\d/ },
    showMask: true,
  });

  return (
    <Card isBlurred className="p-8 flex w-full max-w-7xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col bg-red-5 space-y-6 items-center justify-center z-20"
      >
        <span className="text-2xl">Criar Rifa</span>
        <div className="max-w-md w-full">
          <label htmlFor="name">Nome da rifa</label>
          <Input
            {...register("name", { required: true })}
            type="text"
            name="name"
            id="name"
          />
        </div>

        <div className="max-w-md w-full">
          <label htmlFor="prize_name">Nome do prêmio</label>
          <Input
            {...register("prize_name", { required: true })}
            name="prize_name"
            id="prize_name"
          />
        </div>
        <div className="max-w-md w-full">
          <label htmlFor="start_number">Número inicial</label>
          <Input
            {...register("start_number", {
              required: true,
            })}
            ref={numberRef}
            onChange={(e) => setValue("start_number", Number(e.target.value))}
            name="prize_name"
            id="prize_name"
          />
        </div>
        <div className="max-w-md w-full">
          <label htmlFor="end_number">Número final</label>
          <Input
            {...register("end_number", { required: true })}
            name="end_number"
            ref={numberRef}
            onChange={(e) => setValue("end_number", Number(e.target.value))}
            id="end_number"
            required
          />
        </div>
        <div className="max-w-md w-full">
          <label htmlFor="price_number">Preço da cota</label>
          <Input
            {...register("price_number", { required: true })}
            ref={moneyInputRef}
            onChange={(e) =>
              setValue(
                "price_number",
                Number(e.target.value.replace("R$", "").replace(",", ".")),
              )
            }
            name="price_number"
            id="price_number"
            required
          />
        </div>
        <div className="max-w-md w-full">
          <label htmlFor="min_quantity">Quantidade mínima para compra</label>
          <Input
            {...register("min_quantity", { required: true })}
            name="min_quantity"
            ref={numberRef}
            onChange={(e) => setValue("min_quantity", Number(e.target.value))}
            id="min_quantity"
            required
          />
        </div>

        <div className="max-w-md w-full">
          <Textarea
            label="Descrição da rifa"
            labelPlacement="outside"
            {...register("description")}
            disableAutosize
            classNames={{
              base: "max-w-md",
              label: "text-medium text-white",
              input: "resize-y min-h-[200px] ovevrflow-y-scroll",
            }}
          />
        </div>
        <Button type="submit" color="success" isLoading={isLoading}>
          Criar Rifa
        </Button>
      </form>
    </Card>
  );
}
