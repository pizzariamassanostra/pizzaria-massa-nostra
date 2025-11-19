// Importações de componentes e bibliotecas
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { useMask } from "@react-input/mask";
import { toastError } from "@/lib/toastError";
import Api from "@/common/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useGetOneRaffle } from "@/hooks/common/use-get-one-raffle.hook";
import RafflesList from "@/components/common/raffles-list";
import { ImageContainer } from "@/components/common/image-container";
import { TrashIcon } from "lucide-react";

// Interface do formulário
interface FormData {
  name: string;
  description?: string;
  date_description: string;
  prize_name: string;
  prize_number: number | null;
  gift_numbers: string;
  images: any;
  cover_image: any; // Este campo será substituído por estado manual
}

export default function Home() {
  // Estado para controle de loading
  const [isUpdating, setIsUpdating] = useState(false);

  // Novo estado para armazenar a imagem de capa corretamente
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const router = useRouter();
  const params = useParams();

  // Hook para buscar dados da rifa
  const { raffle, isLoading, refetch } = useGetOneRaffle(
    params?.id ? (params.id as string) : "",
    false
  );

  // Valores padrão do formulário
  const defaultValues = {
    name: raffle?.name,
    description: raffle?.description,
    date_description: raffle?.date_description,
    prize_name: raffle?.prize_name,
    prize_number: raffle?.prize_number,
    gift_numbers: raffle?.gift_numbers.join(","),
  };

  // Hook do react-hook-form
  const { register, handleSubmit, setValue, reset, watch } = useForm<FormData>({
    defaultValues,
  });

  // Atualiza os valores do formulário quando a rifa é carregada
  useEffect(() => {
    reset(defaultValues);
  }, [raffle]);

  // Função para deletar imagem da galeria
  const handleDeletePhoto = async (mediaUrl: string) => {
    try {
      await Api.delete(`/raffles/delete-photo/${raffle?.id}`, {
        data: { mediaUrl },
      });
      toast.success("Imagem deletada com sucesso");
      refetch();
    } catch (error) {
      toastError(error);
    }
  };
  // Função de envio do formulário
  async function onSubmit(data: FormData) {
    if (!raffle) return;
    try {
      let formattedGiftNumber;

      // Converte os números da premiação instantânea para array de números
      if (data.gift_numbers)
        formattedGiftNumber = data.gift_numbers.split(",")?.map(Number);

      const { images, cover_image, ...rest } = data;

      setIsUpdating(true);

      // Atualiza os dados principais da rifa
      await Api.post(`/raffles/update/${raffle?.id}`, {
        ...rest,
        gift_numbers: formattedGiftNumber,
      });

      // Upload das imagens da galeria
      if (images?.length > 0) {
        const form = new FormData();
        for (const img of images) {
          form.append("medias", img);
        }
        await Api.post(`/raffles/upload-photo/${raffle?.id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Imagens da rifa atualizadas com sucesso");
      }

      // Upload da imagem de capa — corrigido para usar estado coverImage
      if (coverImage) {
        const form = new FormData();
        form.append("cover", coverImage);
        await Api.post(`/raffles/update-cover/${raffle?.id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Capa da rifa atualizada com sucesso");
      }

      toast.success("Rifa atualizada com sucesso");
      router.push("/admin");
    } catch (error) {
      toastError(error);
    } finally {
      setIsUpdating(false);
    }
  }

  // Máscara para campo de número premiado
  const numberRef = useMask({ mask: "_______", replacement: { _: /\d/ } });

  return (
    <Card isBlurred className="p-8 flex w-full max-w-7xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col bg-red-5 space-y-6 items-center justify-center z-20"
      >
        <span className="text-2xl">Editando rifa: {raffle?.name}</span>
        <div className="max-w-md w-full">
          <label htmlFor="name">Nome da rifa</label>
          <Input
            {...register("name", { required: true })}
            value={watch("name")}
            type="text"
            name="name"
            id="name"
          />
        </div>

        <div className="max-w-md w-full">
          <label htmlFor="date_description">
            Descrição de qual data será sorteado
          </label>
          <Input
            {...register("date_description")}
            value={watch("date_description")}
            name="date_description"
            id="date_description"
          />
        </div>

        <div className="max-w-md w-full">
          <label htmlFor="prize_name">Nome do prêmio</label>
          <Input
            {...register("prize_name")}
            value={watch("prize_name")}
            name="prize_name"
            id="prize_name"
          />
        </div>

        <div className="max-w-md w-full">
          <label htmlFor="prize_number">Número premiado</label>
          <Input
            value={watch("prize_number")?.toString()}
            ref={numberRef}
            onChange={(e) =>
              setValue(
                "prize_number",
                Number(e.target.value) == 0 ? null : Number(e.target.value)
              )
            }
            name="prize_number"
            id="prize_number"
          />
        </div>

        <div className="max-w-md w-full">
          <label htmlFor="gift_numbers">
            Números da premiação instantânea (separados por vírgula)
          </label>
          <Input
            {...register("gift_numbers")}
            value={watch("gift_numbers")}
            name="gift_numbers"
            id="gift_numbers"
          />
        </div>

        <div className="max-w-md w-full">
          <Textarea
            label="Descrição da rifa"
            labelPlacement="outside"
            {...register("description")}
            value={watch("description")}
            disableAutosize
            classNames={{
              base: "max-w-md",
              label: "text-medium text-white",
              input: "resize-y min-h-[200px] ovevrflow-y-scroll",
            }}
          />
        </div>

        <div className="max-w-md w-full">
          <label>Insira imagens para a rifa</label>
          <input
            type="file"
            accept="image/*"
            {...register("images")}
            multiple
          />
        </div>

        <div className="max-w-md w-full">
          <label>Insira imagem para ser a capa da rifa</label>
          {/* Captura manual do arquivo para evitar falha no react-hook-form */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setCoverImage(file);
            }}
          />
        </div>

        {/* Pré-visualização das imagens da rifa */}
        {(raffle?.medias_url || raffle?.cover_url) &&
          [raffle.cover_url, ...raffle.medias_url].map(
            (image, index) =>
              image && (
                <div
                  key={index}
                  className="h-[200px] flex items-center justify-center"
                >
                  <ImageContainer src={image} />
                  {image !== raffle.cover_url && (
                    <TrashIcon
                      className="cursor-pointer"
                      onClick={() => handleDeletePhoto(image)}
                      color="red"
                    />
                  )}
                </div>
              )
          )}

        {/* Pré-visualização do card da rifa */}
        {raffle && (
          <div className="w-full max-w-3xl space-y-4">
            <span>Pré visualização do card da rifa</span>
            <RafflesList canBuy={false} raffles={[raffle]} />
          </div>
        )}

        {/* Botão de envio */}
        <Button
          type="submit"
          color="success"
          isLoading={isLoading || isUpdating}
        >
          Atualizar Rifa
        </Button>
      </form>
    </Card>
  );
}
