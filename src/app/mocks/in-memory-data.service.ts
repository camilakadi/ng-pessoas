import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const pessoas: Pessoa[] = [
      {
        id: 1,
        nome: 'João Silva Santos',
        cpf: '123.456.789-00',
        sexo: 'M',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-9999',
        dataCadastro: new Date('2024-01-15'),
        ativo: true,
      },
      {
        id: 2,
        nome: 'Maria Oliveira Costa',
        cpf: '987.654.321-00',
        sexo: 'F',
        email: 'maria.oliveira@email.com',
        telefone: '(11) 88888-8888',
        dataCadastro: new Date('2024-01-20'),
        ativo: true,
      },
      {
        id: 3,
        nome: 'Pedro Almeida Lima',
        cpf: '456.789.123-00',
        sexo: 'M',
        email: 'pedro.almeida@email.com',
        telefone: '(11) 77777-7777',
        dataCadastro: new Date('2024-02-01'),
        ativo: true,
      },
      {
        id: 4,
        nome: 'Ana Paula Rodrigues',
        cpf: '789.123.456-00',
        sexo: 'F',
        email: 'ana.rodrigues@email.com',
        telefone: '(11) 66666-6666',
        dataCadastro: new Date('2024-02-10'),
        ativo: true,
      },
      {
        id: 5,
        nome: 'Carlos Eduardo Ferreira',
        cpf: '321.654.987-00',
        sexo: 'M',
        email: 'carlos.ferreira@email.com',
        telefone: '(11) 55555-5555',
        dataCadastro: new Date('2024-02-15'),
        ativo: true,
      },
      {
        id: 6,
        nome: 'Fernanda Santos Silva',
        cpf: '654.321.987-00',
        sexo: 'F',
        email: 'fernanda.santos@email.com',
        telefone: '(11) 44444-4444',
        dataCadastro: new Date('2024-03-01'),
        ativo: true,
      },
      {
        id: 7,
        nome: 'Roberto Costa Oliveira',
        cpf: '147.258.369-00',
        sexo: 'M',
        email: 'roberto.costa@email.com',
        telefone: '(11) 33333-3333',
        dataCadastro: new Date('2024-03-05'),
        ativo: true,
      },
      {
        id: 8,
        nome: 'Juliana Lima Almeida',
        cpf: '258.369.147-00',
        sexo: 'F',
        email: 'juliana.lima@email.com',
        telefone: '(11) 22222-2222',
        dataCadastro: new Date('2024-03-10'),
        ativo: true,
      },
      {
        id: 9,
        nome: 'Lucas Martins Pereira',
        cpf: '369.147.258-00',
        sexo: 'M',
        email: 'lucas.martins@email.com',
        telefone: '(11) 11111-1111',
        dataCadastro: new Date('2024-03-15'),
        ativo: true,
      },
      {
        id: 10,
        nome: 'Camila Ferreira Santos',
        cpf: '951.753.852-00',
        sexo: 'F',
        email: 'camila.ferreira@email.com',
        telefone: '(11) 00000-0000',
        dataCadastro: new Date('2024-03-20'),
        ativo: true,
      },
    ];

    return { pessoas };
  }
}
