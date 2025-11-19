import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Card } from "@nextui-org/card";
import { CircleHelp, MoveRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="bg-black/65 w-full rounded-xl">
      <Card isBlurred className="p-8 items-center space-y-4">
        <div className="py-2 w-full space-x-1 flex justify-center rounded-xl text-white bg-green-800">
          <CircleHelp />
          <span>Perguntas frequentes</span>
        </div>
        <Accordion variant="splitted" selectionMode="multiple">
          <AccordionItem
            key="1"
            aria-label="Como acessar minhas compras?"
            title="Como acessar minhas compras?"
            startContent={<MoveRight />}
          >
            Fazendo login no site e abrindo o Menu Principal, você consegue
            consultar suas últimas compras no menu{`" MINHAS COTAS"`}.
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Como envio o comprovante?ccordion 2"
            title="Como envio o comprovante?"
            startContent={<MoveRight />}
          >
            Caso você tenha feito o pagamento via Pix QR Code ou copiando o
            código, não é necessário enviar o comprovante, aguardando até 5
            minutos após o pagamento, o sistema irá dar baixa automaticamente,
            para mais dúvidas entre em contato conosco.
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() =>
                window.open("https://wa.me/553891920497", "_blank")
              }
            >
              clicando aqui.
            </span>
          </AccordionItem>
          <AccordionItem
            key="3"
            title="Como é o processo do sorteio?"
            startContent={<MoveRight />}
          >
            <div className="inline-block">
              NOSSO SORTEIO SERÁ REALIZADO ASSIM QUE TODAS COTAS FOREM VENDIDAS.
            </div>
            <div className="my-2 inline-block">
              O número sorteado será extraído com base no primeiro prêmio da
              Loteria Federal, considerando os 5 dígitos sem contar o zero
              inicial.
            </div>
            <div className="mb-2">
              Caso numeração ultrapasse o número de bilhetes disponíveis para a
              venda, será desconsiderado o terceiro número da esquerda para
              direita. Quanto mais cotas você comprar, mas chances tem de
              ganhar! Faça a sua fézinha.
            </div>
            <div className="font-bold">A SORTE ESTÁ LANÇADA! 🤞 🍀</div>
          </AccordionItem>
          <AccordionItem
            key="4"
            title="Onde o prêmio será entregue?"
            startContent={<MoveRight />}
          >
            Não há necessidade de se preocupar com os trâmites relacionados a
            entrega do prêmio, pois nós cuidaremos de tudo. Entraremos em
            contato com o ganhador no dia do sorteio e explicaremos os
            procedimentos legais para o recebimento do prêmio que você escolher,
            conforme informado na campanha.
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
