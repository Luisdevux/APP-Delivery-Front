// src/hooks/useCardapio.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { cardapioService, Prato, AdicionalGrupo } from "@/services/cardapioService";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function usePratosRestaurante(restauranteId?: string) {
  return useQuery({
    queryKey: queryKeys.cardapio.porRestaurante(restauranteId || ""),
    queryFn: () => cardapioService.listarPratosPorRestaurante(restauranteId!),
    enabled: !!restauranteId,
  });
}

export function useGruposAdicionais(restauranteId?: string) {
  return useQuery({
    queryKey: ['adicionais-grupos', restauranteId],
    queryFn: () => cardapioService.listarGruposAdicionais(restauranteId!),
    enabled: !!restauranteId,
  });
}

export function usePratoMutations(restauranteId: string, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({ dados, file }: { dados: Partial<Prato>; file?: File | null }) => {
        const res = await cardapioService.criarPrato({ ...dados, restaurante_id: restauranteId });
        if (file) {
            await cardapioService.uploadFotoPrato(res._id, file);
        }
        return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cardapio.porRestaurante(restauranteId) });
      toast.success("Prato adicionado ao cardápio!");
      onSuccessCallback?.();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, dados, file }: { id: string; dados: Partial<Prato>; file?: File | null }) => {
        const res = await cardapioService.atualizarPrato(id, dados);
        if (file) {
            await cardapioService.uploadFotoPrato(id, file);
        }
        return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cardapio.porRestaurante(restauranteId) });
      toast.success("Prato atualizado com sucesso!");
      onSuccessCallback?.();
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cardapioService.deletarPrato(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cardapio.porRestaurante(restauranteId) });
      toast.success("Prato removido do cardápio!");
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  const uploadFotoPratoMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => cardapioService.uploadFotoPrato(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cardapio.porRestaurante(restauranteId) });
      toast.success("Foto do prato atualizada!");
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  });

  return {
    createPrato: createMutation.mutate,
    updatePrato: updateMutation.mutate,
    deletePrato: deleteMutation.mutate,
    uploadFotoPrato: uploadFotoPratoMutation.mutate,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || uploadFotoPratoMutation.isPending,
  };
}

export function useAdicionalMutations(restauranteId?: string, onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();

    const createGrupo = useMutation({
        mutationFn: (dados: Partial<AdicionalGrupo>) => cardapioService.criarGrupoAdicional({ ...dados, restaurante_id: restauranteId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adicionais-grupos', restauranteId] });
            toast.success("Grupo de adicionais criado!");
            onSuccessCallback?.();
        },
        onError: (error: unknown) => toast.error(getErrorMessage(error)),
    });

    const updateGrupo = useMutation({
        mutationFn: ({ id, dados }: { id: string; dados: Partial<AdicionalGrupo> }) => cardapioService.atualizarGrupoAdicional(id, dados),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adicionais-grupos', restauranteId] });
            toast.success("Grupo atualizado!");
            onSuccessCallback?.();
        },
        onError: (error: unknown) => toast.error(getErrorMessage(error)),
    });

    const deleteGrupo = useMutation({
        mutationFn: (id: string) => cardapioService.deletarGrupoAdicional(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adicionais-grupos', restauranteId] });
            toast.success("Grupo removido!");
        },
        onError: (error: unknown) => toast.error(getErrorMessage(error)),
    });

    const uploadFotoAdicionalMutation = useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) => cardapioService.uploadFotoAdicional(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adicionais-opcoes'] });
            toast.success("Foto do adicional atualizada!");
            onSuccessCallback?.();
        },
        onError: (error: unknown) => toast.error(getErrorMessage(error)),
    });

    const deleteFotoAdicionalMutation = useMutation({
        mutationFn: (id: string) => cardapioService.excluirFotoOpcaoAdicional(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adicionais-opcoes'] });
            toast.success("Foto removida!");
        },
        onError: (error: unknown) => toast.error(getErrorMessage(error)),
    });

    return {
        createGrupo: createGrupo.mutate,
        updateGrupo: updateGrupo.mutate,
        deleteGrupo: deleteGrupo.mutate,
        uploadFotoAdicional: uploadFotoAdicionalMutation.mutate,
        deleteFotoAdicional: deleteFotoAdicionalMutation.mutate,
        isUploadingAdicional: uploadFotoAdicionalMutation.isPending,
        isDeletingFotoAdicional: deleteFotoAdicionalMutation.isPending,
        isProcessingGrupo: createGrupo.isPending || updateGrupo.isPending || deleteGrupo.isPending,
    };
}
