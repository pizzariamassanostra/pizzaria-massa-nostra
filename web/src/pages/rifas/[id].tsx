import BuyGrid from "@/components/buy-grid";
import OpenRaffleCard from "@/components/common/open-raffle-card";
import { useGetOneRaffle } from "@/hooks/common/use-get-one-raffle.hook";
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "@nextui-org/skeleton";
import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import WinnersContainer from "@/components/winners-container";
import RaffleDescription from "@/components/raffle-description";
import { CircularProgress } from "@nextui-org/progress";
import { useEffect, useRef, useState } from "react";
import { Card } from "@nextui-org/card";
import { useAppSelector } from "@/lib/redux/store";
import { toastError } from "@/lib/toastError";
import Api from "@/common/api";
import { toast } from "react-toastify";
import CreateCommonUserModal from "@/components/common/create-common-user-modal";
import { useRouter } from "next/router";
import currencyFormatter from "@/lib/currency-formatter";
import GiftPrizesGrid from "@/components/common/gift-prizes-grid";
import { formatNumberToFitZeros } from "@/common/helpers/format-number-to-fit-zeros";
import { useGetTopBuyers } from "@/hooks/common/use-get-top-buyers.hook";
import { firstLastName } from "@/common/helpers/first-last-name";

export default function RafflePage() {
  const [creatingPayment, setCreatingPayment] = useState(false);
  const commonUser = useAppSelector((state) => state.commonUserReducer);
  const params = useParams();
  const searchParams = useSearchParams();
  const buyGridRef = useRef<null | HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const {
    raffle,
    isLoading,
    winners = [],
  } = useGetOneRaffle(params?.id ? (params.id as string) : "", true);

  const { topBuyers } = useGetTopBuyers(
    params?.id ? (params.id as string) : "",
  );

  useEffect(() => {
    const isScroll = searchParams.get("compra-rapida");
    if (isScroll == "true" && window && buyGridRef?.current)
      window.scrollTo({
        top: buyGridRef?.current?.offsetTop,
        behavior: "smooth",
      });
  }, [params, raffle]);

  const handleBuy = async (amount: number) => {
    try {
      setCreatingPayment(true);
      if (!commonUser) {
        setIsModalOpen(true);
        throw new Error("É necessário estar autenticado para comprar Cotas!");
      }

      const { data } = await Api.post("/payment/generate-payment", {
        phone: commonUser.phone,
        amount,
        raffle_id: raffle?.id,
      });
      toast.success("Pagamento criado com sucesso!");
      router.push(`/pagamentos/${data.payment.id}?redirect-on-success=true`);
    } catch (error) {
      toastError(error);
    } finally {
      setCreatingPayment(false);
    }
  };

  return (
    <Skeleton isLoaded={!isLoading} className="rounded-xl">
      <CreateCommonUserModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />

      <div className="flex flex-col space-y-4">
        {raffle && (
          <OpenRaffleCard
            raffle={raffle}
            canBuy={raffle.status === RaffleStatus.OPEN}
            additionalInfo={
              <div className="flex flex-col items-start space-y-2 mt-3">
                <div>
                  Por apenas
                  <span className="rounded-xl ml-2 px-2 py-1 bg-green-800">
                    {currencyFormatter.format(raffle.price_number)}
                  </span>
                </div>
                {raffle.date_description && (
                  <div>
                    Sorteio loteria federal:{" "}
                    <span className="font-bold text-green-600">
                      {raffle.date_description}
                    </span>
                  </div>
                )}
              </div>
            }
          />
        )}
        {raffle?.status === RaffleStatus.OPEN && (
          <div className="bg-black/65 rounded-xl">
            <Card
              isBlurred
              className="p-4 items-center flex flex-col justify-center gap-2"
            >
              <span>Top compradores da ação Sorte Lançada 🚀</span>
              <div className="items-center flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                {topBuyers &&
                  topBuyers?.length > 0 &&
                  topBuyers.map((buyer, index) => (
                    <div className="flex flex-col rounded-xl" key={index}>
                      <Card
                        isBlurred
                        className="w-full text-center font-bold text-white p-8"
                      >
                        <span>{index + 1}°🏅 </span>
                        <span>{firstLastName(buyer.common_user_name)}</span>
                        <span>{buyer.count} cotas</span>
                      </Card>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}
        {raffle?.status === RaffleStatus.OPEN &&
          (creatingPayment ? (
            <div className="bg-black/65 rounded-xl">
              <Card isBlurred className="p-8 items-center space-y-4">
                <CircularProgress
                  classNames={{ svg: "w-24 h-24" }}
                  label="Criando pagamento..."
                  color="success"
                />
              </Card>
            </div>
          ) : (
            <div ref={buyGridRef}>
              <BuyGrid
                raffle={raffle}
                onBuyCallback={(qtd: number) => handleBuy(qtd)}
              />
            </div>
          ))}
        {raffle?.status === RaffleStatus.OPEN && raffle.gift_numbers && (
          <div className="bg-black/65 rounded-xl">
            <Card isBlurred className="p-4 items-center space-y-4">
              <div className="flex flex-row items-center">
                <div className="flex flex-col pl-4">
                  <span>Muitas chances de ganhar na hora! 🍀</span>
                  <span className="font-bold md:text-medium">
                    ainda restam {raffle.gift_numbers?.length - winners?.length}{" "}
                    cotas premiadas! 🎫
                  </span>
                </div>
                <div className="md:pl-4">
                  <img src="/logo.svg" className="h-12 w-12" />
                </div>
              </div>
            </Card>
          </div>
        )}
        {raffle?.status === RaffleStatus.FINISHED && (
          <WinnersContainer raffle={raffle} />
        )}
        {raffle?.status === RaffleStatus.OPEN && (
          <GiftPrizesGrid
            prizeNumbers={formatNumberToFitZeros(
              raffle.gift_numbers,
              raffle.initial_numbers_qtd?.toString()?.length,
            )}
            urnWinners={winners}
          />
        )}
      </div>
      <div className="mt-4">
        {raffle && <RaffleDescription raffle={raffle} />}
      </div>
    </Skeleton>
  );
}
