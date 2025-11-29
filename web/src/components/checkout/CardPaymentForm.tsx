import React, { useState } from "react";
import { CreditCard, Lock } from "lucide-react";

interface CardPaymentFormProps {
  onSubmit: (cardData: any) => void;
}

export const CardPaymentForm: React. FC<CardPaymentFormProps> = ({ onSubmit }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ?  chunks.join(" "). substr(0, 19) : cleaned. substr(0, 16);
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2"). substr(0, 5);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Lock className="w-4 h-4" />
        <span>Seus dados estão seguros</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
            maxLength={19}
            inputMode="numeric"
          />
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value. toUpperCase())}
          placeholder="NOME COMO NO CARTÃO"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/AA"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            maxLength={5}
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value. replace(/\D/g, ""))}
            placeholder="123"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            maxLength={4}
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
};
