import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { toastError } from "@/lib/toastError";
import Api from "@/common/api";
import { toast } from "react-toastify";
import { useGetOneRaffle } from "@/hooks/common/use-get-one-raffle.hook";

export default function FinishRaffle({
  isOpen,
  closeModal,
  raffleId,
  onUpdate,
}: {
  isOpen: boolean;
  closeModal: () => void;
  raffleId: string;
  onUpdate?: () => Promise<void>;
}) {
  const { raffle } = useGetOneRaffle(raffleId);
  async function handleForcePayment() {
    try {
      await Api.post(`/raffles/finish/${raffle?.id}`);
      toast.success("Rifa finalizada com sucesso");
      await onUpdate?.();
    } catch (error) {
      toastError(error);
    } finally {
      closeModal();
    }
  }
  return raffle ? (
    <Card isBlurred>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        backdrop="blur"
        placement="center"
        className="bg-black/50"
      >
        <ModalContent className="max-h-[500px]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deseja finalizar a rifa?
              </ModalHeader>
              <ModalBody>
                <span>Rifa: {raffle.id}</span>
                <span>
                  Ao finalizar a rifa garanta que há um vencedor para o prêmio
                  final, se não houver você receberá um erro. Ao finalizar a
                  rifa todas as cotas compradas serão movidas para outra tabela
                  no banco de dados e a rifa terá status de finalizada. Também
                  não será possível comprar mais cotas.
                </span>
                <span className="font-bold uppercase">
                  Essa ação é irreversível
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onClick={handleForcePayment}
                >
                  Sim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  ) : null;
}
