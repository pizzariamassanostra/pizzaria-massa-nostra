// ============================================
// PÁGINA: MEUS PEDIDOS
// ============================================
// Lista todos os pedidos do cliente
// Filtro por status
// Link para detalhes de cada pedido
// ============================================

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import { orderService, Order } from "@/services/order.service";
import OrderCard from "@/components/order/OrderCard";
import { Loader, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function MeusPedidosPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // ============================================
  // ESTADOS
  // ============================================
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // ============================================
  // VERIFICAR AUTENTICAÇÃO
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login? redirect=/meus-pedidos");
      return;
    }

    loadOrders();
  }, [isAuthenticated, router]);

  // ============================================
  // CARREGAR PEDIDOS
  // ============================================
  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.orders);
      setFilteredOrders(response.orders);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FILTRAR POR STATUS
  // ============================================
  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === selectedStatus)
      );
    }
  }, [selectedStatus, orders]);

  // ============================================
  // OPÇÕES DE FILTRO
  // ============================================
  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "pending", label: "Pendentes" },
    { value: "confirmed", label: "Confirmados" },
    { value: "preparing", label: "Em Preparação" },
    { value: "on_delivery", label: "Em Entrega" },
    { value: "delivered", label: "Entregues" },
    { value: "cancelled", label: "Cancelados" },
  ];

  return (
    <>
      <Head>
        <title>Meus Pedidos - Pizzaria Massa Nostra</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-600">Acompanhe seus pedidos em tempo real</p>
        </div>

        {/* ============================================ */}
        {/* FILTROS */}
        {/* ============================================ */}
        {!loading && orders.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                    selectedStatus === option.value
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        )}

        {/* ============================================ */}
        {/* LISTA DE PEDIDOS */}
        {/* ============================================ */}
        {!loading && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* ============================================ */}
        {/* NENHUM PEDIDO */}
        {/* ============================================ */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Você ainda não fez nenhum pedido
            </h2>
            <p className="text-gray-600 mb-8">
              Que tal pedir uma pizza deliciosa agora?
            </p>
            <Link
              href="/cardapio"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Ver Cardápio
            </Link>
          </div>
        )}

        {/* ============================================ */}
        {/* NENHUM PEDIDO NO FILTRO */}
        {/* ============================================ */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">
              Nenhum pedido encontrado com este status
            </p>
          </div>
        )}
      </div>
    </>
  );
}
