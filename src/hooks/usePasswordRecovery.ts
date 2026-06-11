// src/hooks/usePasswordRecovery.ts

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5020";

export function usePasswordRecovery() {
    const router = useRouter();

    const recoverMutation = useMutation({
        mutationFn: async (email: string) => {
            const response = await fetch(`${API_URL}/recover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao solicitar recuperação');
            }

            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "E-mail de recuperação enviado!");
            router.push("/redefinir-senha");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const resetMutation = useMutation({
        mutationFn: async ({ token, senha }: { token: string; senha: string }) => {
            const response = await fetch(`${API_URL}/password/reset?token=${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao redefinir senha');
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Senha redefinida com sucesso! Faça login com sua nova senha.");
            router.push("/login");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    return {
        recover: recoverMutation.mutate,
        isRecovering: recoverMutation.isPending,
        reset: resetMutation.mutate,
        isResetting: resetMutation.isPending
    };
}
