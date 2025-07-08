import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { delay, of, throwError } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';
import { PessoaFormModalComponent } from './pessoa-form-modal.component';

describe('PessoaFormModalComponent', () => {
  let component: PessoaFormModalComponent;
  let fixture: ComponentFixture<PessoaFormModalComponent>;
  let mockPessoaService: jest.Mocked<PessoaService>;
  let mockDialogRef: jest.Mocked<MatDialogRef<PessoaFormModalComponent>>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  const mockPessoa: Pessoa = {
    id: 1,
    nome: 'Camila Kadi',
    cpf: '123.456.789-00',
    sexo: 'F',
    email: 'camila.kadi@email.com',
    telefone: '(11) 99999-9999',
  };

  beforeEach(async () => {
    const pessoaServiceSpy = {
      criar: jest.fn(),
      cpfUnicoValidator: jest.fn(),
      verificarCPFExistente: jest.fn(),
    };
    const dialogRefSpy = {
      close: jest.fn(),
    };
    const snackBarSpy = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        PessoaFormModalComponent,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: PessoaService, useValue: pessoaServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    mockPessoaService = TestBed.inject(
      PessoaService
    ) as jest.Mocked<PessoaService>;
    mockDialogRef = TestBed.inject(MatDialogRef) as jest.Mocked<
      MatDialogRef<PessoaFormModalComponent>
    >;
    mockSnackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;

    // Mock do validador de CPF único
    mockPessoaService.cpfUnicoValidator.mockReturnValue(() => of(null));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PessoaFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.pessoaForm.get('nome')?.value).toBe('');
    expect(component.pessoaForm.get('cpf')?.value).toBe('');
    expect(component.pessoaForm.get('sexo')?.value).toBe('');
    expect(component.pessoaForm.get('email')?.value).toBe('');
    expect(component.pessoaForm.get('telefone')?.value).toBe('');
  });

  it('should have sexoOptions defined', () => {
    expect(component.sexoOptions).toEqual([
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' },
      { value: 'O', label: 'Outro' },
    ]);
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.pessoaForm;

      expect(form.get('nome')?.hasError('required')).toBeTruthy();
      expect(form.get('cpf')?.hasError('required')).toBeTruthy();
      expect(form.get('sexo')?.hasError('required')).toBeTruthy();
      expect(form.get('email')?.hasError('required')).toBeTruthy();
      expect(form.get('telefone')?.hasError('required')).toBeTruthy();
    });

    it('should validate nome min length', () => {
      const nomeControl = component.pessoaForm.get('nome');
      nomeControl?.setValue('ab');
      expect(nomeControl?.hasError('minlength')).toBeTruthy();
    });

    it('should validate nome max length', () => {
      const nomeControl = component.pessoaForm.get('nome');
      const longName = 'a'.repeat(101);
      nomeControl?.setValue(longName);
      expect(nomeControl?.hasError('maxlength')).toBeTruthy();
    });

    it('should validate CPF format', () => {
      const cpfControl = component.pessoaForm.get('cpf');
      cpfControl?.setValue('12345678900');
      expect(cpfControl?.hasError('pattern')).toBeTruthy();
    });

    it('should accept valid CPF format', () => {
      const cpfControl = component.pessoaForm.get('cpf');
      cpfControl?.setValue('123.456.789-00');
      expect(cpfControl?.hasError('pattern')).toBeFalsy();
    });

    it('should validate email format', () => {
      const emailControl = component.pessoaForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();
    });

    it('should accept valid email format', () => {
      const emailControl = component.pessoaForm.get('email');
      emailControl?.setValue('test@email.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should validate telefone format', () => {
      const telefoneControl = component.pessoaForm.get('telefone');
      telefoneControl?.setValue('11999999999');
      expect(telefoneControl?.hasError('pattern')).toBeTruthy();
    });

    it('should accept valid telefone format', () => {
      const telefoneControl = component.pessoaForm.get('telefone');
      telefoneControl?.setValue('(11) 99999-9999');
      expect(telefoneControl?.hasError('pattern')).toBeFalsy();
    });
  });

  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      const mockEvent = {
        target: { value: '12345678900' },
      };

      component.formatCPF(mockEvent);

      expect(component.pessoaForm.get('cpf')?.value).toBe('123.456.789-00');
    });

    it('should handle CPF with less than 11 digits', () => {
      const mockEvent = {
        target: { value: '123456789' },
      };

      component.formatCPF(mockEvent);

      expect(component.pessoaForm.get('cpf')?.value).toBe('123456789');
    });

    it('should remove non-numeric characters', () => {
      const mockEvent = {
        target: { value: '123.456.789-00' },
      };

      component.formatCPF(mockEvent);

      expect(component.pessoaForm.get('cpf')?.value).toBe('123.456.789-00');
    });
  });

  describe('formatPhone', () => {
    it('should format telefone correctly', () => {
      const mockEvent = {
        target: { value: '11999999999' },
      };

      component.formatPhone(mockEvent);

      expect(component.pessoaForm.get('telefone')?.value).toBe(
        '(11) 99999-9999'
      );
    });

    it('should handle telefone with less than 11 digits', () => {
      const mockEvent = {
        target: { value: '119999999' },
      };

      component.formatPhone(mockEvent);

      expect(component.pessoaForm.get('telefone')?.value).toBe('119999999');
    });

    it('should remove non-numeric characters', () => {
      const mockEvent = {
        target: { value: '(11) 99999-9999' },
      };

      component.formatPhone(mockEvent);

      expect(component.pessoaForm.get('telefone')?.value).toBe(
        '(11) 99999-9999'
      );
    });
  });

  describe('getErrorMessage', () => {
    it('should return required error message', () => {
      const nomeControl = component.pessoaForm.get('nome');
      nomeControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('nome');
      expect(errorMessage).toBe('Nome é obrigatório');
    });

    it('should return email error message', () => {
      const emailControl = component.pessoaForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('email');
      expect(errorMessage).toBe('E-mail inválido');
    });

    it('should return minlength error message', () => {
      const nomeControl = component.pessoaForm.get('nome');
      nomeControl?.setValue('ab');
      nomeControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('nome');
      expect(errorMessage).toBe('Nome deve ter pelo menos 3 caracteres');
    });

    it('should return maxlength error message', () => {
      const nomeControl = component.pessoaForm.get('nome');
      nomeControl?.setValue('a'.repeat(101));
      nomeControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('nome');
      expect(errorMessage).toBe('Nome deve ter no máximo 100 caracteres');
    });

    it('should return CPF pattern error message', () => {
      const cpfControl = component.pessoaForm.get('cpf');
      cpfControl?.setValue('12345678900');
      cpfControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('cpf');
      expect(errorMessage).toBe('CPF deve estar no formato 000.000.000-00');
    });

    it('should return telefone pattern error message', () => {
      const telefoneControl = component.pessoaForm.get('telefone');
      telefoneControl?.setValue('11999999999');
      telefoneControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('telefone');
      expect(errorMessage).toBe(
        'Telefone deve estar no formato (00) 00000-0000'
      );
    });

    it('should return CPF already exists error message', () => {
      const cpfControl = component.pessoaForm.get('cpf');
      cpfControl?.setErrors({ cpfJaExiste: true });
      cpfControl?.markAsTouched();

      const errorMessage = component.getErrorMessage('cpf');
      expect(errorMessage).toBe('CPF já cadastrado no sistema');
    });

    it('should return empty string for unknown field', () => {
      const errorMessage = component.getErrorMessage('unknown');
      expect(errorMessage).toBe('');
    });
  });

  describe('resetForm', () => {
    it('should reset form and submitted flag', () => {
      // Preencher o formulário
      component.pessoaForm.patchValue({
        nome: 'Teste',
        cpf: '123.456.789-00',
        sexo: 'M',
        email: 'teste@email.com',
        telefone: '(11) 99999-9999',
      });
      component.submitted = true;

      component.resetForm();

      expect(component.pessoaForm.get('nome')?.value).toBe(null);
      expect(component.pessoaForm.get('cpf')?.value).toBe(null);
      expect(component.pessoaForm.get('sexo')?.value).toBe(null);
      expect(component.pessoaForm.get('email')?.value).toBe(null);
      expect(component.pessoaForm.get('telefone')?.value).toBe(null);
      expect(component.submitted).toBe(false);
    });
  });

  describe('onCancel', () => {
    it('should close dialog', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Preencher o formulário com dados válidos
      component.pessoaForm.patchValue({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        sexo: 'M',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
      });
    });

    it('should not submit if form is invalid', () => {
      component.pessoaForm.get('nome')?.setValue('');

      component.onSubmit();

      expect(mockPessoaService.criar).not.toHaveBeenCalled();
      expect(component.submitted).toBe(true);
    });

    it('should submit form successfully', fakeAsync(() => {
      mockPessoaService.criar.mockReturnValue(of(mockPessoa));

      component.onSubmit();
      tick();

      expect(component.submitted).toBe(true);
      expect(component.loading).toBe(false);
      expect(mockPessoaService.criar).toHaveBeenCalledWith({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        sexo: 'M',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
      });
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        success: true,
        pessoa: mockPessoa,
      });
    }));

    it('should handle error on submit', fakeAsync(() => {
      const error = { message: 'Erro no servidor' };
      mockPessoaService.criar.mockReturnValue(throwError(() => error));
      jest.spyOn(console, 'error').mockImplementation(() => {});

      component.onSubmit();
      tick();

      expect(component.loading).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao cadastrar pessoa:',
        error
      );
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Erro ao cadastrar pessoa.',
        'Fechar',
        { duration: 5000 }
      );
    }));

    // Testes específicos para a linha 167 (tratamento de erro)
    describe('Error handling in onSubmit (linha 167)', () => {
      beforeEach(() => {
        // Preencher o formulário com dados válidos
        component.pessoaForm.patchValue({
          nome: 'Camila Kadi',
          cpf: '123.456.789-00',
          sexo: 'F',
          email: 'camila.kadi@email.com',
          telefone: '(11) 99999-9999',
        });
      });

      it('should show snackbar with error message when service fails (linha 167)', fakeAsync(() => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const networkError = new Error('Network connection failed');
        mockPessoaService.criar.mockReturnValue(throwError(() => networkError));

        component.onSubmit();
        tick();

        expect(component.loading).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(
          'Erro ao cadastrar pessoa:',
          networkError
        );
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Erro ao cadastrar pessoa.',
          'Fechar',
          { duration: 5000 }
        );

        consoleSpy.mockRestore();
      }));

      it('should handle different types of errors and show snackbar', fakeAsync(() => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const serverError = { status: 500, message: 'Internal Server Error' };
        mockPessoaService.criar.mockReturnValue(throwError(() => serverError));

        component.onSubmit();
        tick();

        expect(component.loading).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(
          'Erro ao cadastrar pessoa:',
          serverError
        );
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Erro ao cadastrar pessoa.',
          'Fechar',
          { duration: 5000 }
        );

        consoleSpy.mockRestore();
      }));

      it('should reset loading state when error occurs', fakeAsync(() => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        mockPessoaService.criar.mockReturnValue(
          throwError(() => new Error('Test error'))
        );

        component.onSubmit();

        tick();

        expect(component.loading).toBe(false);
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Erro ao cadastrar pessoa.',
          'Fechar',
          { duration: 5000 }
        );

        consoleSpy.mockRestore();
      }));

      it('should not close dialog when error occurs', fakeAsync(() => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        mockPessoaService.criar.mockReturnValue(
          throwError(() => new Error('Test error'))
        );

        component.onSubmit();
        tick();

        expect(mockDialogRef.close).not.toHaveBeenCalled();
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Erro ao cadastrar pessoa.',
          'Fechar',
          { duration: 5000 }
        );

        consoleSpy.mockRestore();
      }));
    });

    it('should set loading state during submission', fakeAsync(() => {
      // Garantir que o formulário seja válido
      component.pessoaForm.patchValue({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        sexo: 'M',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
      });

      // Aguardar a validação assíncrona
      fixture.detectChanges();
      tick(600); // Aguardar o delay do validador de CPF
      fixture.detectChanges();

      // Simular resposta assíncrona
      mockPessoaService.criar.mockReturnValue(of(mockPessoa).pipe(delay(1)));

      // O valor de loading deve ser false antes do submit
      expect(component.loading).toBe(false);
      component.onSubmit();
      // O valor de loading deve ser true imediatamente após o submit
      expect(component.loading).toBe(true);
      tick(1);
      // O valor de loading deve ser false após a resposta
      expect(component.loading).toBe(false);
    }));
  });

  describe('Template Integration', () => {
    it('should display form fields', () => {
      const compiled = fixture.nativeElement;

      expect(
        compiled.querySelector('input[formControlName="nome"]')
      ).toBeTruthy();
      expect(
        compiled.querySelector('input[formControlName="cpf"]')
      ).toBeTruthy();
      expect(
        compiled.querySelector('mat-select[formControlName="sexo"]')
      ).toBeTruthy();
      expect(
        compiled.querySelector('input[formControlName="email"]')
      ).toBeTruthy();
      expect(
        compiled.querySelector('input[formControlName="telefone"]')
      ).toBeTruthy();
    });

    it('should display sexo options', () => {
      // Verificar se as opções estão definidas no componente
      expect(component.sexoOptions).toHaveLength(3);
      expect(component.sexoOptions[0].value).toBe('M');
      expect(component.sexoOptions[0].label).toBe('Masculino');
      expect(component.sexoOptions[1].value).toBe('F');
      expect(component.sexoOptions[1].label).toBe('Feminino');
      expect(component.sexoOptions[2].value).toBe('O');
      expect(component.sexoOptions[2].label).toBe('Outro');
    });

    it('should have submit button disabled when form is invalid', () => {
      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector(
        'button[type="button"]:last-child'
      );

      expect(submitButton.disabled).toBe(true);
    });

    it('should have submit button enabled when form is valid', () => {
      component.pessoaForm.patchValue({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        sexo: 'M',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
      });
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector(
        'button[type="button"]:last-child'
      );

      expect(submitButton.disabled).toBe(false);
    });
  });
});
