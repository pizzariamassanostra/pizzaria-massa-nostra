import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useGetOnePayment } from "@/hooks/get-payment.hook";
import currencyFormatter from "@/lib/currency-formatter";
import { toastError } from "@/lib/toastError";
import Api from "@/common/api";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ForcePayment({
  isOpen,
  closeModal,
  paymentId,
  onUpdate,
}: {
  isOpen: boolean;
  closeModal: () => void;
  paymentId: string;
  onUpdate?: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { payment } = useGetOnePayment(paymentId);
  async function handleForcePayment() {
    setIsLoading(true);
    try {
      await Api.post(`/payment/force-confirm-payment/${payment?.id}`);
      toast.success("Pagamento forçado com sucesso");
      await onUpdate?.();
    } catch (error) {
      toastError(error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  }
  return payment ? (
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
                Deseja forçar o pagamento?
              </ModalHeader>
              <ModalBody>
                <span>Pagamento: {payment.id}</span>
                <span>No valor: {currencyFormatter.format(payment.value)}</span>
                <span>
                  Número de cotas a serem compradas: {payment.raffles_quantity}
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
                  disabled={isLoading}
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
