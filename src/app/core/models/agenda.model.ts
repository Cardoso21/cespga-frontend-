export interface Agenda {
  id?: number;
  nome: string;
  dataEvento: string;
  descricao?: string;
  situacao?: { id: number; descricao: string };
}

export interface FotoEvento {
  id?: number;
  url: string;
  descricao?: string;
  dataUpload?: string;
  agendaId: number;
}