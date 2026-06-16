"use client";

import { useMeusRestaurantes } from "@/hooks/useRestaurantes";
import { useAvaliacoesRestaurante } from "@/hooks/useAvaliacoes";
import { 
  Star, 
  User, 
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActiveRestaurante } from "@/hooks/useActiveRestaurante";
import { BlockedOverlay } from "@/components/BlockedOverlay";

export default function AvaliacoesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { activeRestaurante, isComplete } = useActiveRestaurante();
  const { data: restauranteData } = useMeusRestaurantes();
  const restauranteId = activeRestaurante?._id || restauranteData?.docs?.[0]?._id;

  const { data: avaliacoesData, isLoading } = useAvaliacoesRestaurante(restauranteId, { 
    page: currentPage, 
    limite: itemsPerPage 
  });

  const avaliacoes = avaliacoesData?.data?.docs || [];
  const totalPages = avaliacoesData?.data?.totalPages || 1;
  const totalAvaliacoes = avaliacoesData?.data?.totalDocs || 0;

  const renderStars = (nota: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={cn(
          size, 
          i < nota ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-800"
        )} 
      />
    ));
  };

  return (
    <div className="space-y-6 relative min-h-[60vh]">
      {!isComplete && (
        <BlockedOverlay 
            title="Avaliações Bloqueadas" 
            description="Complete o cadastro da sua loja para ver o feedback dos seus clientes."
        />
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Avaliações dos Clientes</h1>
          <p className="text-text-secondary">Acompanhe o que os clientes estão dizendo sobre seu restaurante</p>
        </div>
      </header>

      {/* Overview Cards - Mantidos conforme solicitado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-white border border-border-gray rounded-2xl p-6 flex items-center gap-4 shadow-sm group">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Média Geral</p>
            <h2 className="text-2xl font-bold text-text-primary mt-0.5">
              {activeRestaurante?.avaliacao_media?.toFixed(1) || "0.0"}
            </h2>
            <div className="flex gap-0.5 mt-1">
                {renderStars(Math.round(activeRestaurante?.avaliacao_media || 0), "w-3 h-3")}
            </div>
          </div>
        </div>

        <div className="bg-surface-white border border-border-gray rounded-2xl p-6 flex items-center gap-4 shadow-sm group">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Total</p>
            <h2 className="text-2xl font-bold text-text-primary mt-0.5">{totalAvaliacoes}</h2>
            <p className="text-[10px] text-text-tertiary font-medium">Feedbacks recebidos</p>
          </div>
        </div>

        <div className="bg-primary-green rounded-2xl p-6 flex items-center gap-4 shadow-sm group">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-white">
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Satisfação</p>
            <h2 className="text-2xl font-bold mt-0.5">
                {Math.min(100, Math.round(((activeRestaurante?.avaliacao_media || 0) / 5) * 100))}%
            </h2>
            <p className="text-[10px] font-medium opacity-80">Índice de aprovação</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary-green animate-spin" />
          <p className="text-text-tertiary font-medium">Carregando avaliações...</p>
        </div>
      ) : avaliacoes.length === 0 ? (
        <div className="bg-surface-white border border-border-gray rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-surface-light rounded-[2rem] flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-text-tertiary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Nenhuma avaliação ainda</h2>
          <p className="text-text-secondary max-w-xs">
            As avaliações aparecerão aqui assim que seus clientes começarem a dar feedback sobre os pedidos entregues.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {avaliacoes.map((avaliacao) => (
              <div 
                key={avaliacao._id}
                className="bg-surface-white border border-border-gray rounded-2xl p-6 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-surface-light rounded-xl flex items-center justify-center text-primary-green font-bold text-xl">
                      {avaliacao.cliente_id?.nome?.charAt(0).toUpperCase() || <User />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-text-primary">{avaliacao.cliente_id?.nome || "Cliente anônimo"}</h3>
                        <div className="flex gap-0.5 ml-2">
                          {renderStars(avaliacao.nota)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-tertiary font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(avaliacao.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="bg-surface-light px-2 py-0.5 rounded border border-border-gray text-[9px]">
                          Pedido #{avaliacao.pedido_id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {avaliacao.descricao && (
                  <div className="mt-4 p-4 bg-surface-light rounded-xl border border-border-gray italic text-text-secondary leading-relaxed text-sm">
                    "{avaliacao.descricao}"
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-border-gray">
              <p className="text-sm text-text-tertiary font-medium">
                Página <span className="text-text-primary">{currentPage}</span> de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-10 px-4 font-bold border-border-gray"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-10 px-4 font-bold border-border-gray"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
