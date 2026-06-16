"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { avaliacaoService } from "@/services/avaliacaoService";

export function useAvaliacoesRestaurante(restauranteId?: string, params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['avaliacoes', restauranteId, params],
    queryFn: () => avaliacaoService.listarPorRestaurante(restauranteId!, params),
    enabled: !!restauranteId,
  });
}
