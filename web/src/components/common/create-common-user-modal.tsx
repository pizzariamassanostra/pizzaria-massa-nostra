import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import isValidPhone from "@brazilian-utils/is-valid-phone";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { Card } from "@nextui-org/card";
import { useAppDispatch } from "@/lib/redux/store";
import Api from "@/common/api";
import { toast } from "react-toastify";
import { setCommonUserData } from "@/lib/redux/reducers/common-user.reducer";
import { toastError } from "@/lib/toastError";
import { useMask } from "@react-input/mask";

interface CreateCommonUserModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function CreateCommonUserModal({
  isOpen,
  closeModal,
}: CreateCommonUserModalProps) {
  const dispatch = useAppDispatch();
  const inputRef = useMask({
    mask: "(__) _____-____",
    replacement: { _: /\d/ },
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (!name || !phone) {
        throw new Error("Preencha todos os campos!");
      }
      if (name.trim().split(" ").length < 2) {
        throw new Error("Preencha o nome completo!");
      }
      if (!isValidPhone(phone)) {
        throw new Error("Telefone inválido!");
      }

      const { data } = await Api.post("/common-user/create-or-return", {
        name,
        phone,
      });

      data?.user?.created_at
        ? toast.success("Usuário criado com sucesso!")
        : toast.success("Usuário logado com sucesso!");

      dispatch(setCommonUserData({ name, phone }));
      closeModal();
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card isBlurred>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        backdrop="blur"
        placement="center"
        className="bg-black/50"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span>Cadastro e Login</span>
              </ModalHeader>
              <ModalBody>
                <Input
                  value={name}
                  onValueChange={setName}
                  type="text"
                  label="Nome completo"
                  placeholder="Fulano da Silva"
                />
                <Input
                  value={phone}
                  onValueChange={setPhone}
                  type="text"
                  label="Telefone"
                  placeholder="(99) 99999-9999"
                  ref={inputRef}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleConfirm}
                  isLoading={isLoading}
                >
                  Entrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
