import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();
  return (
    <div className="bottom-0 bg-black flex-col w-full items-center space-y-4 py-4 flex text-center text-tiny break-keep">
      <div>
        <img src="/sortelancada-idea.svg" width={300} />
      </div>
      <div className="flex flex-row space-x-4">
        <img
          src="/whatsapp.svg"
          className="bg-white cursor-pointer rounded-xl my-1"
          onClick={() => window.open("https://bit.ly/3tVdllq", "_blank")}
          height={40}
          width={40}
        />
        <img
          src="/facebook.svg"
          className="bg-white cursor-pointer rounded-xl my-1"
          onClick={() => window.open("https://bit.ly/4b7v8GG", "_blank")}
          height={40}
          width={40}
        />
        <img
          src="/instagram.svg"
          className="cursor-pointer"
          height={35}
          width={45}
          onClick={() => window.open("https://bit.ly/4blp1ia", "_blank")}
        />

        <img
          className="bg-white cursor-pointer rounded-xl my-1"
          onClick={() => window.open("https://t.me/sortelancada", "_blank")}
          src="/telegram.svg"
          height={40}
          width={40}
        />
      </div>
      <div className="max-w-[90vw] space-y-2">
        <span className="block">
          As condições contratuais/regulamento deste produto estão nos “Termos
          de uso”. Confira o resultado dos sorteios e as condições de
          participação em nossa página. Imagens meramente ilustrativas.
        </span>
        <span className="inline-block">
          © 2024 - Todos os direitos reservados
        </span>
        <div className="flex flex-row w-full space-x-1 justify-center">
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/termos-de-uso")}
          >
            Termos de uso
          </div>
          <span>|</span>
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/politicas")}
          >
            {" "}
            Política de Privacidade
          </div>
        </div>
        <div className="flex flex-row w-full space-x-1 justify-center">
          <div>Sistema desenvolvido por sortelancada.com</div>
        </div>
      </div>
    </div>
  );
}
