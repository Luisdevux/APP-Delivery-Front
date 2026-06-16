import { secureFetch } from '@/lib/secureFetch';

export interface Avaliacao {
  _id: string;
  pedido_id: string;
  cliente_id: {
    _id: string;
    nome: string;
  };
  restaurante_id: string;
  nota: number;
  descricao: string;
  createdAt: string;
}

export const avaliacaoService = {
  listarPorRestaurante: async (restauranteId: string, params?: Record<string, string | number>) => {
    return await secureFetch<{ data: { docs: Avaliacao[], totalPages: number, page: number, totalDocs: number } }>({
      endpoint: `/avaliacoes/restaurante/${restauranteId}`,
      params
    });
  }
};
