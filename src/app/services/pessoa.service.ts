import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private apiUrl = 'api/pessoas'; // URL para o InMemoryDataService

  constructor(private http: HttpClient) {}

  // Buscar pessoa por CPF
  buscarPorCPF(cpf: string): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}?cpf=${cpf}`);
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
