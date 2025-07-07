import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, map, switchMap, timer } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private apiUrl = 'api/pessoas'; // URL para o InMemoryDataService

  constructor(private http: HttpClient) {}

  // Validador customizado para CPF único
  cpfUnicoValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      if (!control.value) {
        return new Observable((observer) => observer.next(null));
      }

      return timer(500).pipe(
        switchMap(() => this.verificarCPFExistente(control.value)),
        map((existe) => (existe ? { cpfJaExiste: true } : null))
      );
    };
  }

  // Buscar pessoa por CPF
  buscarPorCPF(cpf: string): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}?cpf=${cpf}`);
  }

  // Verificar se CPF já existe
  verificarCPFExistente(cpf: string): Observable<boolean> {
    return this.buscarPorCPF(cpf).pipe(map((pessoas) => pessoas.length > 0));
  }

  // Buscar todas as pessoas
  buscarTodas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl);
  }

  // Buscar pessoa por ID
  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  // Criar nova pessoa
  criar(pessoa: Omit<Pessoa, 'id'>): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  // Atualizar pessoa
  atualizar(id: number, pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/${id}`, pessoa);
  }

  // Deletar pessoa
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
