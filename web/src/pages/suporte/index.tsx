// ============================================
// PÁGINA: SUPORTE
// ============================================
// FAQ e contato via WhatsApp
// Adaptado para pizzaria
// ============================================

import React from "react";
import Head from "next/head";
import { HelpCircle, MessageCircle } from "lucide-react";

export default function SuportePage() {
  const faqs = [
    {
      question: "Qual o tempo de entrega?",
      answer:
        "O tempo médio de entrega é de 45 minutos, mas pode variar conforme a demanda e sua localização.",
    },
    {
      question: "Qual a área de entrega?",
      answer:
        "Entregamos em toda a região de Montes Claros.  Consulte nosso WhatsApp para confirmar se atendemos seu bairro.",
    },
    {
      question: "Posso pagar na entrega?",
      answer:
        "Sim!  Aceitamos PIX, dinheiro e cartão de débito/crédito na maquininha.",
    },
    {
      question: "Como acompanho meu pedido?",
      answer:
        'Após fazer login, acesse "Meus Pedidos" no menu e veja o status em tempo real.',
    },
    {
      question: "Posso cancelar meu pedido? ",
      answer:
        'Sim, você pode cancelar pedidos com status "Pendente" ou "Confirmado" pela página de detalhes do pedido.',
    },
  ];

  return (
    <>
      <Head>
        <title>Suporte - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <HelpCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Como podemos ajudar?</h1>
            <p className="text-gray-600">
              Confira as perguntas frequentes ou entre em contato conosco
            </p>
          </div>

          {/* FAQ */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <summary className="font-bold text-lg flex items-center gap-2">
                  <span className="text-red-600">→</span>
                  {faq.question}
                </summary>
                <p className="mt-4 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>

          {/* WhatsApp */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ainda tem dúvidas?</h2>
            <p className="text-gray-700 mb-6">
              Fale conosco pelo WhatsApp e teremos prazer em ajudar!
            </p>

            <button
              onClick={() =>
                window.open("https://wa.me/5538999999999", "_blank")
              }
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <button
                onClick={() =>
                  window.open("https://wa.me/5538999999999", "_blank")
                }
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
                <span>Chamar no WhatsApp</span>
              </button>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
