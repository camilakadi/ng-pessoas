import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';
import { FormHeaderComponent } from '../form-header/form-header.component';

@Component({
  selector: 'app-pessoa-consulta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    RouterModule,
    FormHeaderComponent,
  ],
  templateUrl: './pessoa-consulta.component.html',
  styleUrl: './pessoa-consulta.component.scss',
})
export class PessoaConsultaComponent implements OnInit {
  consultaForm!: FormGroup;
  pessoaEncontrada: Pessoa | null = null;
  erroConsulta: string | null = null;
  submitted = false;

  sexoOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
  ];

  constructor(private fb: FormBuilder, private pessoaService: PessoaService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.consultaForm = this.fb.group({
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        ],
      ],
    });
  }

  formatCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    event.target.value = value;
    this.consultaForm.patchValue({ cpf: value });
  }

  onSubmit(): void {
    this.submitted = true;
    this.pessoaEncontrada = null;
    this.erroConsulta = null;

    if (this.consultaForm.valid) {
      const cpf = this.consultaForm.get('cpf')?.value;

      // Buscar pessoa usando o serviço
      this.buscarPessoaPorCPF(cpf);
    }
  }

  buscarPessoaPorCPF(cpf: string): void {
    this.pessoaService.buscarPorCPF(cpf).subscribe({
      next: (pessoas) => {
        if (pessoas && pessoas.length > 0) {
          this.pessoaEncontrada = pessoas[0];
        } else {
          this.erroConsulta = 'Pessoa não encontrada com o CPF informado.';
        }
      },
      error: (error) => {
        console.error('Erro ao buscar pessoa:', error);
        this.erroConsulta = 'Erro ao buscar pessoa. Tente novamente.';
      },
    });
  }

  resetForm(): void {
    this.consultaForm.reset();
    this.pessoaEncontrada = null;
    this.erroConsulta = null;
    this.submitted = false;
  }

  getSexoLabel(sexo: string): string {
    const option = this.sexoOptions.find((opt) => opt.value === sexo);
    return option ? option.label : sexo;
  }
}
