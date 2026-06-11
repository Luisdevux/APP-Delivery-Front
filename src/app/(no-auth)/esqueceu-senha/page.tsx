// src/app/(no-auth)/esqueceu-senha/page.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recoverSchema, type RecoverData } from "@/lib/validations/auth";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";

export default function EsqueceuSenhaPage() {
    const { recover, isRecovering } = usePasswordRecovery();

    const { register, handleSubmit, formState: { errors } } = useForm<RecoverData>({
        resolver: zodResolver(recoverSchema),
    });

    const onSubmit = (data: RecoverData) => {
        recover(data.email);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-surface-light p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-surface-white rounded-xl shadow-lg border border-border-gray">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Image src="/icone-rango.svg" alt="Rango Logo" width={80} height={80} className="mb-2" />
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Recuperar Senha</h1>
                    <p className="text-text-secondary text-sm">
                        Informe o e-mail da sua conta para receber o código de recuperação.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="cursor-pointer">E-mail</Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary-green transition-colors" />
                            <Input
                                id="email"
                                {...register("email")}
                                type="email"
                                placeholder="seu@email.com"
                                className="pl-11"
                            />
                        </div>
                        {errors.email && <p className="text-error-text text-xs">{errors.email.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isRecovering}
                        className="w-full h-11 text-base font-bold mt-2 cursor-pointer active:scale-95 transition-all"
                    >
                        {isRecovering ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Enviando...
                            </span>
                        ) : "Enviar Código"}
                    </Button>
                </form>

                <div className="pt-2 text-center">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center gap-2 text-sm font-bold text-text-tertiary hover:text-primary-green transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </main>
    );
}
