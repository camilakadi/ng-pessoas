export interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  sexo: 'M' | 'F' | 'O';
  email: string;
  telefone: string;
  dataCadastro: Date;
  ativo: boolean;
}
