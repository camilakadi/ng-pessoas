import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';

@Component({
  selector: 'app-pessoa-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './pessoa-form-modal.component.html',
  styleUrls: ['./pessoa-form-modal.component.scss'],
})
export class PessoaFormModalComponent {
  pessoaForm: FormGroup;
  submitted = false;
  loading = false;

  sexoOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ];

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    public dialogRef: MatDialogRef<PessoaFormModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pessoaForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
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
        [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)],
      ],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.pessoaForm.valid) {
      this.loading = true;
      const pessoa: Pessoa = this.pessoaForm.value;

      this.pessoaService.criar(pessoa).subscribe({
        next: (response) => {
          this.loading = false;
          this.dialogRef.close({ success: true, pessoa: response });
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao cadastrar pessoa:', error);
          this.snackBar.open('Erro ao cadastrar pessoa.', 'Fechar', {
            duration: 5000,
          });
        },
      });
    }
  }

  resetForm(): void {
    this.pessoaForm.reset();
    this.submitted = false;
  }

  formatCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      this.pessoaForm.patchValue({ cpf: value });
    }
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      this.pessoaForm.patchValue({ telefone: value });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.pessoaForm.get(field);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(field)} é obrigatório`;
    }
    if (control?.hasError('email')) {
      return 'E-mail inválido';
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldLabel(field)} deve ter pelo menos 3 caracteres`;
    }
    if (control?.hasError('maxlength')) {
      return `${this.getFieldLabel(field)} deve ter no máximo 100 caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (field === 'cpf') {
        return 'CPF deve estar no formato 000.000.000-00';
      }
      if (field === 'telefone') {
        return 'Telefone deve estar no formato (00) 00000-0000';
      }
    }
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      nome: 'Nome',
      cpf: 'CPF',
      sexo: 'Sexo',
      email: 'E-mail',
      telefone: 'Telefone',
    };
    return labels[field] || field;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
