export interface Medium {
  id?: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco?: string;
  sexo?: string;
  nomeMae?: string;
  nomePai?: string;
  dataCadastro: string;
  cargos?: { id: number; descricao: string };
}

export interface PagedResponse<T> {
  _embedded: { [key: string]: T[] };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
