import { RaffleStatus } from "@/common/enum/raffle-status.enum";
import FinishRaffle from "@/components/admin/finish-raffle";
import { useGetRafflesHook } from "@/hooks/admin/get-raffles.hook";
import mmt from "@/lib/mmt";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Check, CrownIcon, Pencil } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
export function Home() {
  const { raffles, refetch } = useGetRafflesHook();
  const router = useRouter();
  const [isFinishRaffleModalOpen, setIsFinishRaffleModalOpen] = useState(false);
  const [selectedRaffleId, setSelectedRaffleId] = useState<string>();

  return (
    <div className="w-full h-min rounded-xl flex justify-center">
      {selectedRaffleId && (
        <FinishRaffle
          isOpen={isFinishRaffleModalOpen}
          closeModal={() => setIsFinishRaffleModalOpen(false)}
          raffleId={selectedRaffleId ?? ""}
          onUpdate={async () => {
            await refetch();
          }}
        />
      )}
      <Card
        isBlurred
        className="flex space-y-4 max-w-7xl p-8 justify-center items-center w-full"
      >
        <div className="w-full flex flex-row justify-between">
          <span className="text-2xl w-1/2 text-end">Suas rifas</span>
          <Button
            onClick={() => router.push("/admin/rifas/criar")}
            className="bg-green-800"
          >
            Criar nova rifa
          </Button>
        </div>
        <div className="flex flex-row gap-3 mr-24 items-center">
          <span>Legenda:</span>
          <div className="cursor-pointer transition-all hover:text-green-500 flex flex-col items-center">
            <Pencil />
            <span>Editar</span>
          </div>
          <div className="cursor-pointer transition-all hover:text-green-500 flex flex-col items-center">
            <CrownIcon />
            <span>Ganhador</span>
          </div>
          <div
            onClick={() => {
              setIsFinishRaffleModalOpen(true);
            }}
            className="cursor-pointer transition-all hover:text-green-500 flex flex-col items-center"
          >
            <Check />
            <span>Finalizar</span>
          </div>
        </div>
        <Table className="max-w-3x w-full">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Prêmio</TableColumn>
            <TableColumn>Quantidade de Cotas</TableColumn>
            <TableColumn>Cotas vendidas</TableColumn>
            <TableColumn>Porcentagem vendida</TableColumn>
            <TableColumn>Porcentagem restante</TableColumn>
            <TableColumn>Ação criada</TableColumn>
            <TableColumn>Última atualização</TableColumn>
            <TableColumn>Ações</TableColumn>
          </TableHeader>
          <TableBody>
            {raffles
              ? raffles.map((raffle) => (
                  <TableRow key={raffle.id}>
                    <TableCell>{raffle.id}</TableCell>
                    <TableCell>{raffle.prize_name}</TableCell>
                    <TableCell>{raffle.initial_numbers_qtd}</TableCell>
                    <TableCell>
                      {raffle.initial_numbers_qtd -
                        (raffle.available_numbers_qtd ?? 0)}
                    </TableCell>
                    <TableCell>
                      {(
                        100 -
                        ((raffle.available_numbers_qtd ?? 0) /
                          raffle.initial_numbers_qtd) *
                          100
                      ).toFixed(2)}
                      %
                    </TableCell>
                    <TableCell>
                      {(
                        ((raffle.available_numbers_qtd ?? 0) /
                          raffle.initial_numbers_qtd) *
                        100
                      ).toFixed(2)}
                      %
                    </TableCell>
                    <TableCell>
                      {mmt(raffle.created_at).format("DD-MM-YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      {mmt(raffle.updated_at).format("DD-MM-YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell className="flex flex-row space-x-2">
                      <div
                        onClick={() =>
                          router.push(`/admin/rifas/editar/${raffle.id}`)
                        }
                        className="cursor-pointer transition-all hover:text-green-500 flex flex-col items-center"
                      >
                        <Pencil />
                      </div>
                      <div
                        onClick={() =>
                          router.push(`/admin/rifas/${raffle.id}/vencedores`)
                        }
                        className="cursor-pointer transition-all hover:text-green-500 flex flex-col items-center"
                      >
                        <CrownIcon />
                      </div>
                      {raffle.status === RaffleStatus.OPEN && (
                        <div
                          onClick={() => {
                            setSelectedRaffleId(raffle.id);
                            setIsFinishRaffleModalOpen(true);
                          }}
                          className="cursor-pointer transition-all hover:text-green-500 flex flex-col items-center"
                        >
                          <Check />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              : []}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
export default Home;
