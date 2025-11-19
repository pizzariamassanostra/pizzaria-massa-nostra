// Importa estilos globais e estilos do Toastify (notificações)
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

// Tipagem para propriedades do componente principal da aplicação
import type { AppProps } from "next/app";

// React Query para gerenciamento de cache e requisições
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Componentes visuais e de layout
import LayoutHeader from "@/components/LayoutHeader";
import Footer from "@/components/footer";
import TitleWithLogo from "@/components/title-with-logo";

// Redux para gerenciamento de estado global
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

// Toastify para exibir notificações
import { ToastContainer } from "react-toastify";

// Hook do Next.js para obter a rota atual
import { usePathname } from "next/navigation";

// Função de verificação de autenticação para rotas protegidas
import isAuth from "@/common/enum/guard/isAuth";

// Hooks do React para controle de renderização e efeitos
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Instância do React Query para cache e requisições
  const queryClient = new QueryClient();

  // Obtém o caminho atual da rota
  const pathname = usePathname();

  // Executa verificação de autenticação apenas no cliente (evita erro de hidratação)
  useEffect(() => {
    if (pathname?.includes("admin")) {
      isAuth();
    }
  }, [pathname]);

  // Controla se o componente está sendo renderizado no cliente
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Evita renderização no servidor para prevenir erro de hidratação
  if (!isClient) return null;

  return (
    // Provedor do React Query
    <QueryClientProvider client={queryClient}>
      {/* Provedor do Redux */}
      <Provider store={store}>
        {/* Container de notificações */}
        <ToastContainer theme="dark" />

        {/* Cabeçalho fixo da aplicação */}
        <LayoutHeader />

        {/* Renderização condicional para rotas administrativas */}
        {pathname && pathname?.includes("admin") ? (
          // Layout para páginas administrativas
          <div className="min-h-screen bg-fixed bg-contain md:bg-cover bg-left-top bg-repeat-y bg-[url('/sortelancada-transformed2.webp')] p-8 w-full h-full flex justify-center overflow-y-auto">
            <Component {...pageProps} />
          </div>
        ) : (
          <>
            {/* Layout para páginas públicas */}
            <div className="text-black bg-fixed bg-contain md:bg-cover bg-left-top bg-repeat-y min-h-screen bg-[url('/sortelancada-transformed2.webp')] w-full h-full flex justify-center overflow-y-auto">
              <div className="space-y-4 my-8 h-full w-full px-8 md:max-w-3xl overflow-y-hidden flex flex-col justify-center items-center">
                {/* Título com logotipo */}
                <TitleWithLogo />

                {/* Componente da página atual */}
                <Component {...pageProps} />
              </div>
            </div>

            {/* Botão fixo de suporte via WhatsApp */}
            <div className="w-full cursor-pointer sticky pr-4 bottom-10 right-0 bg-none flex justify-end">
              <div
                className="bg-black flex-row flex px-2 py-1 space-x-1 rounded-xl"
                onClick={() =>
                  window.open("https://wa.me/553891920497", "_blank")
                }
              >
                <span className="font-bold">Suporte</span>
                <img src="/whatsapp.svg" height={20} width={20} />
              </div>
            </div>

            {/* Rodapé da aplicação */}
            <Footer />
          </>
        )}
      </Provider>
    </QueryClientProvider>
  );
}
