import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable, map, of, switchMap, timer } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private apiUrl = 'api/pessoas'; // URL para o InMemoryDataService

  constructor(private http: HttpClient) {}

  // Função para validar CPF brasileiro
  private validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    const calcularDigito = (base: string, peso: number) => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base[i]) * peso--;
      }
      const resto = soma % 11;
      return resto < 2 ? '0' : String(11 - resto);
    };

    const digito1 = calcularDigito(cpf.slice(0, 9), 10);
    const digito2 = calcularDigito(cpf.slice(0, 10), 11);

    const cpfValido = cpf.endsWith(digito1 + digito2);

    return cpfValido;
  }

  // Validador síncrono para CPF válido
  cpfValidoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const cpf = control.value;
      return this.validarCPF(cpf) ? null : { cpfInvalido: true };
    };
  }

  // Validador customizado para CPF único
  cpfUnicoValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      if (!control.value) {
        return of(null);
      }

      if (!this.validarCPF(control.value)) {
        return of({ cpfInvalido: true });
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
