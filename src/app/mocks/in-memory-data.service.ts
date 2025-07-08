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
        nome: 'Camila Kadi',
        cpf: '123.456.789-00',
        sexo: 'F',
        email: 'camila.kadi@email.com',
        telefone: '(11) 99999-9999',
      },
      {
        id: 2,
        nome: 'Matheus Moreira',
        cpf: '987.654.321-00',
        sexo: 'M',
        email: 'matheus.moreira@email.com',
        telefone: '(11) 88888-8888',
      },
      {
        id: 3,
        nome: 'Pedro Almeida Lima',
        cpf: '456.789.123-00',
        sexo: 'M',
        email: 'pedro.almeida@email.com',
        telefone: '(11) 77777-7777',
      },
      {
        id: 4,
        nome: 'Ana Paula Rodrigues',
        cpf: '789.123.456-00',
        sexo: 'F',
        email: 'ana.rodrigues@email.com',
        telefone: '(11) 66666-6666',
      },
      {
        id: 5,
        nome: 'Carlos Eduardo Ferreira',
        cpf: '321.654.987-00',
        sexo: 'M',
        email: 'carlos.ferreira@email.com',
        telefone: '(11) 55555-5555',
      },
      {
        id: 6,
        nome: 'Fernanda Santos Silva',
        cpf: '654.321.987-00',
        sexo: 'F',
        email: 'fernanda.santos@email.com',
        telefone: '(11) 44444-4444',
      },
      {
        id: 7,
        nome: 'Roberto Costa Oliveira',
        cpf: '147.258.369-00',
        sexo: 'M',
        email: 'roberto.costa@email.com',
        telefone: '(11) 33333-3333',
      },
      {
        id: 8,
        nome: 'Juliana Lima Almeida',
        cpf: '258.369.147-00',
        sexo: 'F',
        email: 'juliana.lima@email.com',
        telefone: '(11) 22222-2222',
      },
      {
        id: 9,
        nome: 'Lucas Martins Pereira',
        cpf: '369.147.258-00',
        sexo: 'M',
        email: 'lucas.martins@email.com',
        telefone: '(11) 11111-1111',
      },
      {
        id: 10,
        nome: 'Camila Ferreira Santos',
        cpf: '951.753.852-00',
        sexo: 'F',
        email: 'camila.ferreira@email.com',
        telefone: '(11) 00000-0000',
      },
      {
        id: 11,
        nome: 'Maria João Silva',
        cpf: '159.357.486-00',
        sexo: 'O',
        email: 'maria.joao@email.com',
        telefone: '(11) 12345-6789',
      },
    ];

    return { pessoas };
  }
}
