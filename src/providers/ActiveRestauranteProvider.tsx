"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import { useMeusRestaurantes, useEnderecoRestaurante, useRestauranteMutations } from "@/hooks/useRestaurantes";
import { Restaurante } from "@/services/restauranteService";
import { isRestauranteNoHorario } from "@/lib/utils";

interface ActiveRestauranteContextType {
  activeRestaurante: Restaurante | undefined;
  activeRestauranteId: string | undefined;
  restaurantes: Restaurante[];
  isLoading: boolean;
  isComplete: boolean;
  hasAddress: boolean;
  selectRestaurante: (id: string) => void;
  isWithinHours: boolean;
  setManualOverride: (id: string) => void;
}

const ActiveRestauranteContext = createContext<ActiveRestauranteContextType | undefined>(undefined);

export function ActiveRestauranteProvider({ children }: { children: React.ReactNode }) {
  const { data: restauranteData, isLoading } = useMeusRestaurantes();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  // Carregar overrides do localStorage no início
  useEffect(() => {
    const savedOverrides = localStorage.getItem("rango-status-overrides");
    if (savedOverrides) {
        try {
            setOverrides(JSON.parse(savedOverrides));
        } catch {
            localStorage.removeItem("rango-status-overrides");
        }
    }
  }, []);

  const restaurantes = useMemo(() => restauranteData?.docs || [], [restauranteData]);

  useEffect(() => {
    if (restaurantes.length > 0 && !activeId) {
      const savedId = localStorage.getItem("rango-active-restaurante");
      const exists = restaurantes.some(r => r._id === savedId);
      
      if (savedId && exists) {
        setActiveId(savedId);
      } else {
        setActiveId(restaurantes[0]._id);
      }
    }
  }, [restaurantes, activeId]);

  const activeRestaurante = useMemo(() => {
    return restaurantes.find(r => r._id === activeId) || restaurantes[0];
  }, [restaurantes, activeId]);

  // Hook de mutação para sync automático
  const { saveStatus } = useRestauranteMutations(activeRestaurante?._id);

  // Verificação de horário
  const isWithinHours = useMemo(() => {
    return isRestauranteNoHorario(activeRestaurante?.horario_funcionamento);
  }, [activeRestaurante]);

  const setManualOverride = (id: string) => {
    const newOverrides = { ...overrides, [id]: true };
    setOverrides(newOverrides);
    localStorage.setItem("rango-status-overrides", JSON.stringify(newOverrides));
  };

  // Sincronização Automática (Apenas se não foi alterado manualmente)
  useEffect(() => {
    if (!isLoading && activeRestaurante && activeRestaurante._id && !overrides[activeRestaurante._id]) {
      const dbStatus = activeRestaurante.status;
      const shouldBeOpen = isWithinHours;

      if (shouldBeOpen && dbStatus === 'fechado') {
        saveStatus('aberto', { 
            suppressToast: true,
            onSuccess: () => { /* Sucesso silencioso */ }
        });
      } else if (!shouldBeOpen && dbStatus === 'aberto') {
        saveStatus('fechado', {
            suppressToast: true,
            onSuccess: () => { /* Sucesso silencioso */ }
        });
      }
    }
  }, [activeRestaurante, isWithinHours, saveStatus, isLoading, overrides]);
  
  // Verificação de endereço
  const { data: endereco, isLoading: isLoadingEnd } = useEnderecoRestaurante(activeRestaurante?._id);

  const selectRestaurante = (id: string) => {
    setActiveId(id);
    localStorage.setItem("rango-active-restaurante", id);
  };

  const isComplete = !!(activeRestaurante?.cnpj && endereco);
  const hasAddress = !!endereco;

  return (
    <ActiveRestauranteContext.Provider 
      value={{ 
        activeRestaurante, 
        activeRestauranteId: activeRestaurante?._id, 
        restaurantes, 
        isLoading: isLoading || (restaurantes.length > 0 && isLoadingEnd), 
        isComplete,
        hasAddress,
        selectRestaurante,
        isWithinHours,
        setManualOverride
      }}
    >
      {children}
    </ActiveRestauranteContext.Provider>
  );
}

export function useActiveRestaurante() {
  const context = useContext(ActiveRestauranteContext);
  if (context === undefined) {
    throw new Error("useActiveRestaurante must be used within an ActiveRestauranteProvider");
  }
  return context;
}
