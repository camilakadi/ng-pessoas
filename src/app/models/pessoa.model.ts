export interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  sexo: 'M' | 'F';
  email: string;
  telefone: string;
  dataCadastro: Date;
  ativo: boolean;
}
