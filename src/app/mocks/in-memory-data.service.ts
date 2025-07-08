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
        cpf: '543.134.150-25',
        sexo: 'F',
        email: 'camila.kadi@email.com',
        telefone: '(11) 99999-9999',
      },
      {
        id: 2,
        nome: 'Matheus Moreira',
        cpf: '611.129.480-66',
        sexo: 'M',
        email: 'matheus.moreira@email.com',
        telefone: '(11) 88888-8888',
      },
      {
        id: 3,
        nome: 'Pedro Almeida Lima',
        cpf: '587.683.400-95',
        sexo: 'M',
        email: 'pedro.almeida@email.com',
        telefone: '(11) 77777-7777',
      },
      {
        id: 4,
        nome: 'Ana Paula Rodrigues',
        cpf: '913.362.490-99',
        sexo: 'F',
        email: 'ana.rodrigues@email.com',
        telefone: '(11) 66666-6666',
      },
      {
        id: 5,
        nome: 'Carlos Eduardo Ferreira',
        cpf: '587.211.110-06',
        sexo: 'M',
        email: 'carlos.ferreira@email.com',
        telefone: '(11) 55555-5555',
      },
      {
        id: 6,
        nome: 'Fernanda Santos Silva',
        cpf: '606.402.750-95',
        sexo: 'F',
        email: 'fernanda.santos@email.com',
        telefone: '(11) 44444-4444',
      },
      {
        id: 7,
        nome: 'Roberto Costa Oliveira',
        cpf: '893.318.510-06',
        sexo: 'M',
        email: 'roberto.costa@email.com',
        telefone: '(11) 33333-3333',
      },
      {
        id: 8,
        nome: 'Juliana Lima Almeida',
        cpf: '391.716.320-93',
        sexo: 'F',
        email: 'juliana.lima@email.com',
        telefone: '(11) 22222-2222',
      },
      {
        id: 9,
        nome: 'Lucas Martins Pereira',
        cpf: '355.813.540-73',
        sexo: 'M',
        email: 'lucas.martins@email.com',
        telefone: '(11) 11111-1111',
      },
      {
        id: 10,
        nome: 'Camila Ferreira Santos',
        cpf: '529.774.060-69',
        sexo: 'F',
        email: 'camila.ferreira@email.com',
        telefone: '(11) 00000-0000',
      },
      {
        id: 11,
        nome: 'Maria João Silva',
        cpf: '135.558.640-25',
        sexo: 'O',
        email: 'maria.joao@email.com',
        telefone: '(11) 12345-6789',
      },
    ];

    return { pessoas };
  }
}
