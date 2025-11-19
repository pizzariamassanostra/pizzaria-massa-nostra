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
import { CommonUser } from "@/common/interfaces/common-users.interface";
import { Input } from "@nextui-org/input";
import { useState } from "react";

export default function UpdateCommonUser({
  isOpen,
  closeModal,
  commonUser,
  onUpdated,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onUpdated?: () => Promise<void>;
  commonUser?: CommonUser;
}) {
  const [userName, setUserName] = useState<string>(commonUser?.name as string);
  async function handleUpdateUser() {
    try {
      await Api.post(`/common-user/update-user-by-phone/${commonUser?.phone}`, {
        name: userName,
      });
      onUpdated?.();
      toast.success("Nome do usuário atualizado com sucesso");
    } catch (error) {
      toastError(error);
    } finally {
      closeModal();
    }
  }
  return commonUser ? (
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
                Atualizando o usuário {commonUser.id}
              </ModalHeader>
              <ModalBody>
                <Input
                  defaultValue={commonUser?.name}
                  label="Nome"
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  value={commonUser.phone}
                  label="Telefone"
                  disabled
                  className="opacity-60"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="success"
                  variant="solid"
                  onClick={handleUpdateUser}
                >
                  Atualizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  ) : null;
}
