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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { PessoaService } from '../../services/pessoa.service';
import { FormHeaderComponent } from '../form-header/form-header.component';

@Component({
  selector: 'app-pessoa-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    FormHeaderComponent,
  ],
  templateUrl: './pessoa-form.component.html',
  styleUrl: './pessoa-form.component.scss',
})
export class PessoaFormComponent implements OnInit {
  pessoaForm!: FormGroup;
  submitted = false;

  sexoOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ];

  constructor(private fb: FormBuilder, private pessoaService: PessoaService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.pessoaForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        ],
      ],
      sexo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)],
      ],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.pessoaForm.valid) {
      const novaPessoa = {
        ...this.pessoaForm.value,
        dataCadastro: new Date(),
        ativo: true,
      };

      this.pessoaService.criar(novaPessoa).subscribe({
        next: (pessoa) => {
          console.log('Pessoa criada com sucesso:', pessoa);
          alert('Pessoa cadastrada com sucesso!');
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro ao criar pessoa:', error);
          alert('Erro ao cadastrar pessoa. Tente novamente.');
        },
      });
    } else {
      console.log('Formulário inválido:', this.pessoaForm.errors);
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.pessoaForm.reset();
    this.submitted = false;
  }

  markFormGroupTouched(): void {
    Object.keys(this.pessoaForm.controls).forEach((key) => {
      const control = this.pessoaForm.get(key);
      control?.markAsTouched();
    });
  }

  formatCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    this.pessoaForm.patchValue({ cpf: value });
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      if (value.length > 10) {
        value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
      }
    }
    this.pessoaForm.patchValue({ telefone: value });
  }

  getErrorMessage(controlName: string): string {
    const control = this.pessoaForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo de ${requiredLength} caracteres`;
    }

    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo de ${requiredLength} caracteres`;
    }

    if (control?.hasError('email')) {
      return 'E-mail inválido';
    }

    if (control?.hasError('pattern')) {
      if (controlName === 'cpf') {
        return 'CPF deve estar no formato: 000.000.000-00';
      }
      if (controlName === 'telefone') {
        return 'Telefone deve estar no formato: (00) 00000-0000';
      }
    }

    return '';
  }
}
