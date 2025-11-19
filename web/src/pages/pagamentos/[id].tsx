// Importações de componentes, hooks e utilitários
import { Card } from "@nextui-org/card";
import { useParams, useSearchParams } from "next/navigation";
import { useGetOnePayment } from "@/hooks/get-payment.hook";
import { Skeleton } from "@nextui-org/skeleton";
import currencyFormatter from "@/lib/currency-formatter";
import { PaymentStatus } from "@/common/enum/payment-status.enum";
import mmt from "@/lib/mmt";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTimer } from "react-timer-hook";
import { useEffect, useState } from "react";
import PaymentStatusBadge from "@/components/common/payment-status-badge";
import { toastError } from "@/lib/toastError";
import { useRouter } from "next/router";
import { useGetOneRaffle } from "@/hooks/common/use-get-one-raffle.hook";

// Componente principal da página de detalhes do pagamento
export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams(); // Captura o ID da URL
  const searchParams = useSearchParams(); // Captura parâmetros da query string
  const [winnerNumbers, setWinnerNumbers] = useState<number[]>([]); // Números premiados

  // Hook para buscar o pagamento pelo ID
  const { payment, isLoading, refetch } = useGetOnePayment(
    params?.id ? (params.id as string) : ""
  );

  // Hook para buscar a rifa associada ao pagamento
  const { raffle } = useGetOneRaffle(payment?.raffle_id ?? "");

  // Hook de timer para mostrar tempo restante até expiração
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: payment?.expires_at ?? mmt().add(15, "minutes").toDate(),
    onExpire: () => {
      if (payment?.status === PaymentStatus.PENDING)
        toastError(new Error("Pagamento expirado!"));
    },
  });

  // Redireciona para "minhas cotas" se o pagamento for confirmado
  useEffect(() => {
    const shouldRedirect = searchParams.get("redirect-on-success");
    if (payment?.status === PaymentStatus.PENDING) {
      restart(mmt(payment?.expires_at).toDate());
    } else if (payment?.status === PaymentStatus.SUCCESS) {
      if (shouldRedirect === "true") {
        router.push("/minhas-cotas");
      }
    }
  }, [payment]);

  // Identifica os números premiados e separa os não-premiados
  useEffect(() => {
    if (
      raffle !== undefined &&
      raffle?.gift_numbers.length > 0 &&
      payment !== undefined
    ) {
      const paymentNumbers = payment.users_raffle_number.map(
        (urn) => urn.number
      );
      const winners = paymentNumbers.filter((number) =>
        raffle?.gift_numbers.includes(number.toString())
      );
      setWinnerNumbers(winners);
      payment.users_raffle_number = payment.users_raffle_number.filter(
        (urn) => !winners.includes(urn.number)
      );
    }
  }, [raffle]);

  // Atualiza o pagamento a cada 15 segundos
  const fifteen_sec = 15000;
  useEffect(() => {
    const interval = setInterval(async () => {
      await refetch();
    }, fifteen_sec);

    return () => clearInterval(interval);
  }, []);

  return (
    // Esqueleto de carregamento enquanto busca os dados
    <Skeleton isLoaded={!isLoading} className="rounded-xl">
      <div className="bg-black/65 rounded-xl w-full h-full">
        {payment && (
          <Card isBlurred className="p-8 space-y-4">
            {/* Exibe o timer de expiração se o pagamento estiver pendente */}
            {payment.status === PaymentStatus.PENDING && (
              <div className="text-center bg-red-700/40 w-fit self-center p-3 rounded-xl">
                <span>Este pagamento irá expirar em </span>
                <div>
                  <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
                  {` minuto${minutes != 1 ? "s" : ""} e `}
                  <span>{seconds < 10 ? `0${seconds}` : seconds}</span>{" "}
                  {`segundo${seconds != 1 ? "s" : ""}`}
                </div>
              </div>
            )}

            {/* Título da seção */}
            <span className="md:text-2xl">
              Aqui estão os dados do seu pagamento!
            </span>

            {/* Detalhes do pagamento */}
            <div className="flex flex-col text-tiny md:text-medium">
              <span className="font-bold uppercase">detalhes</span>
              <span>ID: {payment?.id}</span>
              <span>Quantidade comprada: {payment.raffles_quantity} cotas</span>
              <span>
                Status: <PaymentStatusBadge status={payment.status} />
              </span>
              <span>Valor: {currencyFormatter.format(payment.value)}</span>
              {payment?.status === PaymentStatus.SUCCESS && (
                <span className="text-green-500">
                  Pago em: {mmt(payment.paid_at).format("DD-MM-YYYY HH:mm:ss")}
                </span>
              )}
            </div>

            {/* Se o pagamento foi confirmado, exibe cotas e premiados */}
            {payment?.status === PaymentStatus.SUCCESS ? (
              <span>
                Cotas geradas:{" "}
                <div>
                  {winnerNumbers.map((wn, i) => {
                    return (
                      <span className="mr-1" key={i}>
                        <span
                          key={wn}
                          className="text-black bg-yellow-400 px-1 rounded-lg animate-pulse"
                        >
                          {wn}
                        </span>
                        ,
                      </span>
                    );
                  })}
                  <span>
                    {payment.users_raffle_number
                      .map((urn) => urn.number)
                      .join(", ")}
                  </span>
                </div>
              </span>
            ) : (
              // Se ainda estiver pendente, exibe QR Code e botão de copiar
              <>
                <div className="flex rounded-xl justify-center w-full">
                  <img
                    className="rounded-xl md:max-h-96 md:max-w-96"
                    src={`data:image/gif;base64,${payment.pix_qr_code}`}
                    alt="QR Code PIX"
                  />
                </div>
                <span className="text-center">
                  Se preferir, copie o código abaixo
                </span>
                <div className="flex flex-row space-x-4">
                  <Input value={payment.pix_code} disabled id="pix_code" />
                  <CopyToClipboard text={payment.pix_code}>
                    <Button
                      color="success"
                      className="w-min"
                      onClick={() => {
                        toast.success("Copiado com sucesso!");
                      }}
                    >
                      Copiar
                    </Button>
                  </CopyToClipboard>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </Skeleton>
  );
}
