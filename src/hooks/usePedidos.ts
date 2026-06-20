// src/hooks/usePedidos.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { pedidoService, Pedido } from "@/services/pedidoService";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { playNotificationSound } from "@/lib/audio";

export function usePedidosRestaurante(restauranteId?: string, params?: Record<string, string | number>) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: queryKeys.pedidos.porRestaurante(restauranteId || "", params),
    queryFn: () => pedidoService.listarPorRestaurante(restauranteId!, params),
    enabled: !!restauranteId,
  });

  useEffect(() => {
    if (!restauranteId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5020";
    const socket: Socket = io(apiUrl);

    socket.on("connect", () => {
      socket.emit("joinRestaurantRoom", restauranteId);
    });

    socket.on("newOrder", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.porRestaurante(restauranteId) });
    });

    socket.on("orderStatusUpdated", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.porRestaurante(restauranteId) });
    });

    return () => {
      socket.disconnect();
    };
  }, [restauranteId, queryClient]);

  const prevCriadosCount = useRef<number | null>(null);

  useEffect(() => {
    if (query.data?.docs) {
      const currentCriados = query.data.docs.filter(p => p.status === 'criado').length;
      
      if (prevCriadosCount.current !== null && currentCriados > prevCriadosCount.current) {
        toast.info("Novo pedido recebido!", {
          description: "Um novo pedido acaba de chegar para o seu restaurante.",
          duration: 10000,
        });
        playNotificationSound();
      }
      
      prevCriadosCount.current = currentCriados;
    }
  }, [query.data]);

  return query;
}

export function usePedidoMutations(restauranteId: string) {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Pedido['status'] }) => 
      pedidoService.atualizarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pedidos.porRestaurante(restauranteId) });
      toast.success("Status do pedido atualizado!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar status.");
    },
  });

  return {
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
  };
}
