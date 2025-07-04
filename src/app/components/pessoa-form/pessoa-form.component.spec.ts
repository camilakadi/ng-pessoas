import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';
import { PessoaFormComponent } from './pessoa-form.component';

describe('PessoaFormComponent', () => {
  let component: PessoaFormComponent;
  let fixture: ComponentFixture<PessoaFormComponent>;
  let pessoaService: jest.Mocked<PessoaService>;

  const mockPessoaService = {
    criar: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PessoaFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: PessoaService, useValue: mockPessoaService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaFormComponent);
    component = fixture.componentInstance;
    pessoaService = TestBed.inject(PessoaService) as jest.Mocked<PessoaService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  it('should have required validators on all fields', () => {
    const nomeControl = component.pessoaForm.get('nome');
    const cpfControl = component.pessoaForm.get('cpf');
    const sexoControl = component.pessoaForm.get('sexo');
    const emailControl = component.pessoaForm.get('email');
    const telefoneControl = component.pessoaForm.get('telefone');

    expect(nomeControl?.hasError('required')).toBeTruthy();
    expect(cpfControl?.hasError('required')).toBeTruthy();
    expect(sexoControl?.hasError('required')).toBeTruthy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(telefoneControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.pessoaForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate CPF format', () => {
    const cpfControl = component.pessoaForm.get('cpf');

    cpfControl?.setValue('12345678901');
    expect(cpfControl?.hasError('pattern')).toBeTruthy();

    cpfControl?.setValue('123.456.789-01');
    expect(cpfControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate phone format', () => {
    const telefoneControl = component.pessoaForm.get('telefone');

    telefoneControl?.setValue('11999999999');
    expect(telefoneControl?.hasError('pattern')).toBeTruthy();

    telefoneControl?.setValue('(11) 99999-9999');
    expect(telefoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should format CPF correctly', () => {
    const event = { target: { value: '12345678901' } };
    component.formatCPF(event);
    expect(component.pessoaForm.get('cpf')?.value).toBe('123.456.789-01');
  });

  it('should format phone correctly', () => {
    const event = { target: { value: '11999999999' } };
    component.formatPhone(event);
    expect(component.pessoaForm.get('telefone')?.value).toBe('(11) 99999-9999');
  });

  it('should submit form successfully when valid', () => {
    const mockPessoa: Pessoa = {
      id: 1,
      nome: 'João Silva',
      cpf: '123.456.789-01',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      dataCadastro: new Date(),
      ativo: true,
    };

    pessoaService.criar.mockReturnValue(of(mockPessoa));

    // Preencher formulário com dados válidos
    component.pessoaForm.patchValue({
      nome: 'João Silva',
      cpf: '123.456.789-01',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
    });

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onSubmit();

    expect(pessoaService.criar).toHaveBeenCalledWith({
      nome: 'João Silva',
      cpf: '123.456.789-01',
      sexo: 'M',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      dataCadastro: expect.any(Date),
      ativo: true,
    });

    expect(alertSpy).toHaveBeenCalledWith('Pessoa cadastrada com sucesso!');
    alertSpy.mockRestore();
  });

  it('should not submit form when invalid', () => {
    component.onSubmit();

    expect(pessoaService.criar).not.toHaveBeenCalled();
    expect(component.submitted).toBeTruthy();
  });

  it('should reset form correctly', () => {
    component.pessoaForm.patchValue({
      nome: 'Test',
      cpf: '123.456.789-01',
      sexo: 'M',
      email: 'test@email.com',
      telefone: '(11) 99999-9999',
    });
    component.submitted = true;

    component.resetForm();

    expect(component.pessoaForm.get('nome')?.value).toBeNull();
    expect(component.submitted).toBeFalsy();
  });

  it('should return correct error messages', () => {
    const nomeControl = component.pessoaForm.get('nome');

    nomeControl?.setValue('');
    nomeControl?.markAsTouched();
    expect(component.getErrorMessage('nome')).toBe('Este campo é obrigatório');

    nomeControl?.setValue('a');
    expect(component.getErrorMessage('nome')).toBe('Mínimo de 2 caracteres');

    nomeControl?.setValue('a'.repeat(101));
    expect(component.getErrorMessage('nome')).toBe('Máximo de 100 caracteres');
  });
});
