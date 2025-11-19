// Importações principais do React e ícones visuais
import { ReactElement, useEffect, useState } from "react";
import {
  ChevronLeft,
  CircleDollarSign,
  Handshake,
  HelpCircle,
  HomeIcon,
  LogOut,
  ScrollText,
  Star,
  Ticket,
  UserPlus,
  Zap,
} from "lucide-react";

// Componente de modal para cadastro de usuário comum
import CreateCommonUserModal from "@/components/common/create-common-user-modal";

// Navegação com Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

// Redux: hooks personalizados para acessar e modificar o estado global
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { clearCommonUserData } from "@/lib/redux/reducers/common-user.reducer";

// Axios configurado para chamadas à API
import Api from "@/common/api";

// Enum que define o status das rifas
import { RaffleStatus } from "@/common/enum/raffle-status.enum";

// Função para extrair primeiro e último nome do usuário
import { firstLastName } from "@/common/helpers/first-last-name";

// Componente para itens funcionais (ações como login, logout)
const SidebarFunctionItem: React.FC<{
  label: string;
  icon: ReactElement;
  onClick: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-row items-center transition-colors duration-300 mx-3 my-1 rounded-lg justify-start p-2  pl-3 text-white hover:bg-black hover:bg-opacity-20`}
    >
      {icon}
      <span className={`ml-2 transition-all`}>{label}</span>
    </div>
  );
};

// Componente para itens de navegação (links para páginas)
const SidebarItem: React.FC<{
  label: string;
  icon: ReactElement;
  url: string;
  isSelected?: boolean;
}> = ({ icon, label, url, isSelected }) => {
  return (
    <Link
      href={url}
      className={`flex flex-row items-center transition-colors duration-300 mx-3 my-1 rounded-lg justify-start p-2  pl-3 ${
        isSelected
          ? "bg-white text-black"
          : "text-white hover:bg-black hover:bg-opacity-20"
      }`}
    >
      {icon}
      <span className={`ml-2 transition-all`}>{label}</span>
    </Link>
  );
};

// Componente principal da sidebar
export const CommonSidebarComponent = ({
  isOpen,
  toggleIsOpen,
}: {
  isOpen: boolean;
  toggleIsOpen: () => void;
}) => {
  // Rota atual
  const location = usePathname();

  // Navegador do Next.js
  const router = useRouter();

  // Estado para controlar abertura do modal de cadastro
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado global do usuário comum
  const commonUser = useAppSelector((state) => state.commonUserReducer);
  const dispatch = useAppDispatch();

  // Estado para armazenar o ID da rifa atual
  const [currentRaffleId, setCurrentRaffleId] = useState(null);

  // Função para buscar a rifa atual (aberta)
  const fetchCurrentRaffle = async () => {
    try {
      // Protege contra erro de rede: só executa no cliente
      if (typeof window === "undefined") return;

      const { data } = await Api.get(
        `/raffles/list?status=${RaffleStatus.OPEN}`
      );
      const currentRaffle = data.raffles[0];
      if (!currentRaffle) return;

      setCurrentRaffleId(currentRaffle.id);
    } catch (error) {
      console.error("Erro ao buscar rifa atual:", error);
    }
  };

  // Executa ao montar o componente
  useEffect(() => {
    fetchCurrentRaffle();
  }, []);

  // Fecha a sidebar ao mudar de rota
  useEffect(() => {
    if (isOpen) toggleIsOpen();
  }, [location]);
  // Renderização do componente
  // Renderiza o componente da sidebar
  // Renderiza o componente da sidebar
  return (
    <>
      {/* Container externo da sidebar com controle de visibilidade e animação */}
      <div
        className={`${
          isOpen ? "absolute left-0" : "absolute -left-52"
        } transition-all`}
      >
        {/* Estrutura principal da sidebar com largura dinâmica e sombra */}
        <div
          className={`relative z-30 flex flex-col h-screen justify-between bg-secondary shadow-lg md:w-[68px]`}
          style={{
            transition: `width ease-in-out 0.2s`,
            width: isOpen ? 224 : 0,
          }}
        >
          {/* Conteúdo interno da sidebar dividido em topo e base */}
          <div className={`flex flex-col h-full mb-10 justify-between`}>
            <div className="space-y-4">
              {/* Cabeçalho com imagem animada e botão de recolher */}
              <div className="flex items-center flex-col">
                <div className="flex items-center flex-row align-center justify-evenly my-3 p-0 shadow pb-[11px]">
                  <img
                    src="/moneyedolar.gif"
                    style={{ height: 100, width: 100 }}
                    alt=""
                  />
                  <div className="cursor-pointer" onClick={toggleIsOpen}>
                    <ChevronLeft color="white" />
                  </div>
                </div>

                {/* Saudação personalizada ao usuário logado */}
                {commonUser && (
                  <span className="w-full text-center">
                    Bem vindo(a) {firstLastName(commonUser?.name)}
                  </span>
                )}
              </div>

              {/* Modal de cadastro de usuário comum */}
              <CreateCommonUserModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
              />

              {/* Item de navegação para página inicial */}
              <SidebarItem
                isSelected={location === "/"}
                label="Início"
                icon={<HomeIcon />}
                url="/"
              />

              {/* Botão de cadastro/login para usuários não autenticados */}
              {!commonUser && (
                <SidebarFunctionItem
                  label="Cadastro/Login"
                  icon={<UserPlus />}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                />
              )}

              {/* Link para compra rápida da rifa atual */}
              <SidebarItem
                isSelected={location === `/rifas/${currentRaffleId}`}
                label="Compra Rápida"
                icon={<Zap />}
                url={`/rifas/${currentRaffleId}?compra-rapida=true`}
              />

              {/* Link para página de rifas disponíveis */}
              <SidebarItem
                isSelected={location === "/rifas"}
                label="Rifas"
                icon={<CircleDollarSign />}
                url="/rifas"
              />

              {/* Link para página de cotas compradas pelo usuário */}
              <SidebarItem
                isSelected={location === "/minhas-cotas"}
                label="Minhas Cotas"
                icon={<Ticket />}
                url="/minhas-cotas"
              />

              {/* Link para página de ganhadores das rifas */}
              <SidebarItem
                isSelected={location === "/ganhadores"}
                label="Ganhadores"
                icon={<Star />}
                url="/ganhadores"
              />
            </div>

            {/* Seção inferior com links institucionais e botão de logout */}
            <div className="">
              {/* Link para página de políticas da plataforma */}
              <SidebarItem
                isSelected={location === "/politicas"}
                label="Políticas"
                icon={<Handshake />}
                url="/politicas"
              />

              {/* Link para página de termos de uso */}
              <SidebarItem
                isSelected={location === "/termos-de-uso"}
                label="Termos de uso"
                icon={<ScrollText />}
                url="/termos-de-uso"
              />

              {/* Link para página de suporte e dúvidas */}
              <SidebarItem
                isSelected={location === "/suporte"}
                label="Dúvidas e Suporte"
                icon={<HelpCircle />}
                url="/suporte"
              />

              {/* Botão de logout para usuários autenticados */}
              {commonUser && (
                <SidebarFunctionItem
                  label="Sair"
                  icon={<LogOut color="gray" />}
                  onClick={() => {
                    dispatch(clearCommonUserData());
                    router.push("/");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camada de fundo escura que fecha a sidebar ao clicar fora */}
      <div
        onClick={toggleIsOpen}
        className={`absolute top-0 left-0 z-10 ${
          isOpen ? "w-screen opacity-80" : "w-0 opacity-0 invisible"
        } h-screen bg-secondary transition-opacity`}
      />
    </>
  );
};
