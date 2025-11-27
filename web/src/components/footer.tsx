import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();

  const handleKey = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      action();
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/pizzariamassanostra-idea.svg"
            width={250}
            alt="Logo Pizzaria Massa Nostra"
            className="max-w-full h-auto"
          />
        </div>

        {/* Redes Sociais */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
            onClick={() => window.open("https://wa.me/5538999999999", "_blank")}
            aria-label="WhatsApp"
          >
            <img src="/whatsapp.svg" height={32} width={32} alt="WhatsApp" />
          </button>

          <button
            className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
            onClick={() =>
              window.open("https://facebook.com/pizzariamassanostra", "_blank")
            }
            aria-label="Facebook"
          >
            <img src="/facebook.svg" height={32} width={32} alt="Facebook" />
          </button>

          <button
            className="rounded-full p-2 hover:opacity-80 transition-opacity"
            onClick={() =>
              window.open("https://instagram.com/pizzariamassanostra", "_blank")
            }
            aria-label="Instagram"
          >
            <img src="/instagram.svg" height={32} width={32} alt="Instagram" />
          </button>

          <button
            className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
            onClick={() =>
              window.open("https://t.me/pizzariamassanostra", "_blank")
            }
            aria-label="Telegram"
          >
            <img src="/telegram.svg" height={32} width={32} alt="Telegram" />
          </button>
        </div>

        {/* Informações */}
        <div className="max-w-3xl mx-auto text-center space-y-4 text-sm text-gray-400">
          <p>
            Pizzaria Massa Nostra - Delivery de pizzas artesanais em Montes
            Claros/MG. Ingredientes frescos, massa artesanal e muito sabor!
          </p>

          <p>Horário de funcionamento: Seg-Sex 18h-23h | Sáb-Dom 18h-00h</p>

          <p className="text-xs">
            Imagens meramente ilustrativas. Consulte preços e disponibilidade no
            cardápio.
          </p>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <p>
              © {new Date().getFullYear()} Pizzaria Massa Nostra - Todos os
              direitos reservados
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-4 text-sm">
            <button
              className="text-blue-400 hover:text-blue-300 underline"
              onClick={() => router.push("/termos-de-uso")}
              onKeyDown={(e) =>
                handleKey(e, () => router.push("/termos-de-uso"))
              }
            >
              Termos de Uso
            </button>

            <span>|</span>

            <button
              className="text-blue-400 hover:text-blue-300 underline"
              onClick={() => router.push("/politicas")}
              onKeyDown={(e) => handleKey(e, () => router.push("/politicas"))}
            >
              Política de Privacidade
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Sistema desenvolvido por Pizzaria Massa Nostra
          </p>
        </div>
      </div>
    </footer>
  );
}
