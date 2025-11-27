// ============================================
// PÁGINA: CHECKOUT
// ============================================
// Finalização do pedido
// Seleção de endereço ou cadastro de novo
// Escolha de forma de pagamento
// Confirmação e criação do pedido
// ============================================

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  addressService,
  Address,
  CreateAddressDto,
} from "@/services/address.service";
import { orderService } from "@/services/order.service";
import {
  MapPin,
  CreditCard,
  Banknote,
  DollarSign,
  Plus,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // ============================================
  // ESTADOS
  // ============================================
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Formulário de novo endereço
  const [newAddress, setNewAddress] = useState<CreateAddressDto>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "Montes Claros",
    state: "MG",
    zip_code: "",
    reference: "",
    is_default: false,
  });

  // ============================================
  // VERIFICAR AUTENTICAÇÃO
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // Verificar se tem itens no carrinho
    if (items.length === 0) {
      router.push("/cardapio");
      return;
    }

    loadAddresses();
  }, [isAuthenticated, items, router]);

  // ============================================
  // CARREGAR ENDEREÇOS DO USUÁRIO
  // ============================================
  const loadAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressService.getMyAddresses();
      setAddresses(response.addresses);

      // Selecionar endereço padrão automaticamente
      const defaultAddress = response.addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // ============================================
  // BUSCAR CEP
  // ============================================
  const handleSearchCep = async () => {
    const cleanCep = newAddress.zip_code.replaceAll(/\D/g, "");

    if (cleanCep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }

    try {
      const data = await addressService.searchCep(cleanCep);

      setNewAddress((prev) => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));

      toast.success("CEP encontrado!");
    } catch (error: unknown) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("CEP não encontrado");
    }
  };

  // ============================================
  // CADASTRAR NOVO ENDEREÇO
  // ============================================
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await addressService.create(newAddress);

      setAddresses((prev) => [...prev, response.address]);
      setSelectedAddress(response.address.id);
      setShowNewAddressForm(false);
      toast.success("Endereço cadastrado com sucesso!");

      // Limpar formulário
      setNewAddress({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "Montes Claros",
        state: "MG",
        zip_code: "",
        reference: "",
        is_default: false,
      });
    } catch (error: unknown) {
      console.error("Erro ao cadastrar endereço:", error);
      toast.error("Erro ao cadastrar endereço");
    }
  };

  // ============================================
  // FINALIZAR PEDIDO
  // ============================================
  const handleFinishOrder = async () => {
    // Validações
    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    if (!paymentMethod) {
      toast.error("Selecione uma forma de pagamento");
      return;
    }

    setLoading(true);

    try {
      // Montar payload do pedido
      const orderData = {
        address_id: selectedAddress,
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          crust_id: item.crust_id || undefined,
          filling_id: item.filling_id || undefined,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod as any,
      };

      // Criar pedido
      const response = await orderService.create(orderData);

      // Limpar carrinho
      clearCart();

      toast.success("Pedido realizado com sucesso!");
      router.push(`/meus-pedidos/${response.order.id}`);
    } catch (error: unknown) {
      console.error("Erro ao finalizar pedido:", error);

      const userMessage =
        (error as any)?.response?.data?.errors?.[0]?.userMessage ||
        "Erro ao finalizar pedido";

      toast.error(userMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FORMATAR PREÇO
  // ============================================
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <>
      <Head>
        <title>Finalizar Pedido - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============================================ */}
          {/* COLUNA ESQUERDA: ENDEREÇO E PAGAMENTO */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ========== ENDEREÇO ========== */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-600" />
                  Endereço de Entrega
                </h2>

                {!showNewAddressForm && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-5 h-5" />
                    Novo Endereço
                  </button>
                )}
              </div>

              {/* Loading endereços */}
              {loadingAddresses && (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              )}

              {/* Lista de endereços */}
              {!loadingAddresses && !showNewAddressForm && (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? "border-red-600 bg-red-50"
                          : "border-gray-300 hover:border-red-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="mt-1 text-red-600 focus:ring-red-500"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">
                          {address.street}, {address.number}
                        </p>
                        {address.complement && (
                          <p className="text-sm text-gray-600">
                            {address.complement}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {address.neighborhood}, {address.city}/{address.state}
                        </p>
                        <p className="text-sm text-gray-600">
                          CEP: {address.zip_code}
                        </p>
                        {address.reference && (
                          <p className="text-sm text-gray-500">
                            Ref: {address.reference}
                          </p>
                        )}
                        {address.is_default && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Padrão
                          </span>
                        )}
                      </div>
                    </label>
                  ))}

                  {addresses.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Você ainda não tem endereços cadastrados
                    </p>
                  )}
                </div>
              )}

              {/* Formulário de novo endereço */}
              {showNewAddressForm && (
                <form onSubmit={handleCreateAddress} className="space-y-4">
                  {/* CEP */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="CEP"
                      value={newAddress.zip_code}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          zip_code: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      maxLength={9}
                    />
                    <button
                      type="button"
                      onClick={handleSearchCep}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Buscar
                    </button>
                  </div>

                  {/* Rua e Número */}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Rua"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nº"
                      value={newAddress.number}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, number: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Complemento */}
                  <input
                    type="text"
                    placeholder="Complemento (opcional)"
                    value={newAddress.complement}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        complement: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  {/* Bairro */}
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={newAddress.neighborhood}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        neighborhood: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />

                  {/* Cidade e Estado */}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="UF"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      maxLength={2}
                      required
                    />
                  </div>

                  {/* Referência */}
                  <input
                    type="text"
                    placeholder="Ponto de referência (opcional)"
                    value={newAddress.reference}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        reference: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />

                  {/* Botões */}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    >
                      Salvar Endereço
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ========== FORMA DE PAGAMENTO ========== */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-red-600" />
                Forma de Pagamento
              </h2>

              <div className="space-y-3">
                {/* PIX */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "pix"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={paymentMethod === "pix"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <span className="font-semibold">PIX</span>
                </label>

                {/* Dinheiro */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "dinheiro"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="dinheiro"
                    checked={paymentMethod === "dinheiro"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <Banknote className="w-6 h-6 text-green-700" />
                  <span className="font-semibold">Dinheiro</span>
                </label>

                {/* Cartão de Débito */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cartao_debito"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cartao_debito"
                    checked={paymentMethod === "cartao_debito"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold">Cartão de Débito</span>
                </label>

                {/* Cartão de Crédito */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cartao_credito"
                      ? "border-red-600 bg-red-50"
                      : "border-gray-300 hover:border-red-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cartao_credito"
                    checked={paymentMethod === "cartao_credito"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold">Cartão de Crédito</span>
                </label>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* COLUNA DIREITA: RESUMO DO PEDIDO */}
          {/* ============================================ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

              {/* Itens */}
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(total - 5)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxa de Entrega</span>
                  <span className="font-semibold">{formatPrice(5)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Botão finalizar */}
              <button
                onClick={handleFinishOrder}
                disabled={loading || !selectedAddress || !paymentMethod}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processando..." : "Confirmar Pedido"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Ao confirmar, você concorda com nossos termos de uso
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
