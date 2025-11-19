import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import PaymentCard from "@/components/common/payment-card";
import { useGetOnePayment } from "@/hooks/get-payment.hook";

export default function PreviewPayment({
  isOpen,
  closeModal,
  paymentId,
}: {
  isOpen: boolean;
  closeModal: () => void;
  paymentId: string;
}) {
  const { payment } = useGetOnePayment(paymentId);

  return payment ? (
    <Card isBlurred>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        backdrop="blur"
        placement="center"
        className="bg-black/50"
      >
        <ModalContent className="max-h-[500px] overflow-y-scroll">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span>Pagamento: {payment.id}</span>
              </ModalHeader>
              <ModalBody>
                <PaymentCard payment={payment} />
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  ) : null;
}
