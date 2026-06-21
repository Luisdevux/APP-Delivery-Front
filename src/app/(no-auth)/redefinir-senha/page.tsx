// src/app/(no-auth)/redefinir-senha/page.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordData } from "@/lib/validations/auth";
import { KeyRound, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";

function RedefinirSenhaForm() {
    const { reset, isResetting } = usePasswordRecovery();
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const tokenFromUrl = searchParams.get("token") || "";

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: tokenFromUrl
        }
    });

    const onSubmit = (data: ResetPasswordData) => {
        reset({ token: data.token, senha: data.senha });
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-surface-light p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-surface-white rounded-xl shadow-lg border border-border-gray">
                <div className="flex flex-col items-center text-center space-y-4">
                    <Image src="/icone-rango.svg" alt="Rango Logo" width={80} height={80} className="mb-2" />
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Nova Senha</h1>
                    <p className="text-text-secondary text-sm">
                        Digite o código enviado para o seu e-mail e escolha sua nova senha.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="token" className="cursor-pointer">Código de Recuperação</Label>
                        <div className="relative group">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary-green transition-colors" />
                            <Input
                                id="token"
                                {...register("token")}
                                placeholder="Cole o código aqui"
                                className="pl-11 font-mono uppercase tracking-[0.2em]"
                            />
                        </div>
                        {errors.token && <p className="text-error-text text-xs">{errors.token.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="senha" title="Senha" className="cursor-pointer">Nova Senha</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary-green transition-colors" />
                            <Input
                                id="senha"
                                {...register("senha")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-11 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-primary-green transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.senha && <p className="text-error-text text-xs">{errors.senha.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="confirmarSenha" title="Confirmar Senha" className="cursor-pointer">Confirmar Nova Senha</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-primary-green transition-colors" />
                            <Input
                                id="confirmarSenha"
                                {...register("confirmarSenha")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-11"
                            />
                        </div>
                        {errors.confirmarSenha && <p className="text-error-text text-xs">{errors.confirmarSenha.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isResetting}
                        className="w-full h-11 text-base font-bold mt-2 cursor-pointer active:scale-95 transition-all"
                    >
                        {isResetting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Redefinindo...
                            </span>
                        ) : "Redefinir Senha"}
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

export default function RedefinirSenhaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface-light"><Loader2 className="w-8 h-8 animate-spin text-primary-green" /></div>}>
            <RedefinirSenhaForm />
        </Suspense>
    );
}
