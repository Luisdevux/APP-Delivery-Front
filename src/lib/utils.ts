import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeFormatDate(date: string | Date | null | undefined, formatStr: string = "dd/MM/yyyy HH:mm"): string {
  if (!date) return "--/--/---- --:--";
  
  try {
    let d: Date;
    if (typeof date === 'string') {
      // Tenta converter formato brasileiro DD/MM/YYYY para Date se necessário
      if (date.includes('/') && !date.includes('T')) {
        const [day, month, year] = date.split('/').map(Number);
        d = new Date(year, month - 1, day);
      } else {
        d = new Date(date);
      }
    } else {
      d = date;
    }

    if (isNaN(d.getTime())) return "--/--/---- --:--";
    return format(d, formatStr, { locale: ptBR });
  } catch {
    return "--/--/---- --:--";
  }
}

/**
 * Extrai uma mensagem de erro amigável de um objeto de erro (ex: retornado pelo secureFetch)
 */
export function getErrorMessage(error: unknown): string {
    const err = error as { message?: string; data?: { message?: string; errors?: Array<{ message?: string; msg?: string }> } };
    
    // Se for erro retornado pelo secureFetch (formato da nossa API)
    if (err?.data?.message) return err.data.message;
    
    // Se houver lista de erros detalhados (Zod ou validação customizada)
    if (err?.data?.errors && Array.isArray(err.data.errors) && err.data.errors.length > 0) {
        return err.data.errors[0].message || err.data.errors[0].msg || "Dados inválidos.";
    }

    // Erros padrão do JS/Fetch
    if (err?.message) return err.message;

    return "Ocorreu um erro inesperado. Tente novamente.";
}
