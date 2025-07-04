import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';
import { PessoaService } from '../../services/pessoa.service';
import { FormHeaderComponent } from '../form-header/form-header.component';
import { PessoaConsultaComponent } from './pessoa-consulta.component';

describe('PessoaConsultaComponent', () => {
  let component: PessoaConsultaComponent;
  let fixture: ComponentFixture<PessoaConsultaComponent>;
  let pessoaService: jest.Mocked<PessoaService>;

  const mockPessoaService = {
    buscarPorCPF: jest.fn(),
  };

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PessoaConsultaComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatDividerModule,
        BrowserAnimationsModule,
        FormHeaderComponent,
      ],
      providers: [
        { provide: PessoaService, useValue: mockPessoaService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaConsultaComponent);
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
    expect(component.consultaForm.get('cpf')?.value).toBe('');
  });

  it('should have required validator on CPF field', () => {
    const cpfControl = component.consultaForm.get('cpf');
    expect(cpfControl?.hasError('required')).toBeTruthy();
  });

  it('should validate CPF format', () => {
    const cpfControl = component.consultaForm.get('cpf');

    cpfControl?.setValue('12345678901');
    expect(cpfControl?.hasError('pattern')).toBeTruthy();

    cpfControl?.setValue('123.456.789-01');
    expect(cpfControl?.hasError('pattern')).toBeFalsy();
  });

  it('should format CPF with partial input', () => {
    const event = { target: { value: '123456' } };
    component.formatCPF(event);
    expect(component.consultaForm.get('cpf')?.value).toBe('123.456');
  });

  it('should format CPF with full input', () => {
    const event = { target: { value: '12345678901' } };
    component.formatCPF(event);
    expect(component.consultaForm.get('cpf')?.value).toBe('123.456.789-01');
  });

  it('should submit form successfully when valid', () => {
    pessoaService.buscarPorCPF.mockReturnValue(of([mockPessoa]));

    component.consultaForm.patchValue({
      cpf: '123.456.789-01',
    });

    component.onSubmit();

    expect(pessoaService.buscarPorCPF).toHaveBeenCalledWith('123.456.789-01');
    expect(component.submitted).toBeTruthy();
    expect(component.pessoaEncontrada).toEqual(mockPessoa);
  });

  it('should not submit form when invalid', () => {
    component.onSubmit();

    expect(pessoaService.buscarPorCPF).not.toHaveBeenCalled();
    expect(component.submitted).toBeTruthy();
  });

  it('should handle successful person search', () => {
    pessoaService.buscarPorCPF.mockReturnValue(of([mockPessoa]));

    component.buscarPessoaPorCPF('123.456.789-01');

    expect(component.pessoaEncontrada).toEqual(mockPessoa);
    expect(component.erroConsulta).toBeNull();
  });

  it('should handle person not found', () => {
    pessoaService.buscarPorCPF.mockReturnValue(of([]));

    component.buscarPessoaPorCPF('123.456.789-01');

    expect(component.pessoaEncontrada).toBeNull();
    expect(component.erroConsulta).toBe(
      'Pessoa não encontrada com o CPF informado.'
    );
  });

  it('should handle service error', () => {
    pessoaService.buscarPorCPF.mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    component.buscarPessoaPorCPF('123.456.789-01');

    expect(component.pessoaEncontrada).toBeNull();
    expect(component.erroConsulta).toBe(
      'Erro ao buscar pessoa. Tente novamente.'
    );
  });

  it('should reset form correctly', () => {
    component.consultaForm.patchValue({ cpf: '123.456.789-01' });
    component.pessoaEncontrada = mockPessoa;
    component.erroConsulta = 'Test error';
    component.submitted = true;

    component.resetForm();

    expect(component.consultaForm.get('cpf')?.value).toBeNull();
    expect(component.pessoaEncontrada).toBeNull();
    expect(component.erroConsulta).toBeNull();
    expect(component.submitted).toBeFalsy();
  });

  it('should return correct sexo label', () => {
    expect(component.getSexoLabel('M')).toBe('Masculino');
    expect(component.getSexoLabel('F')).toBe('Feminino');
    expect(component.getSexoLabel('X')).toBe('X'); // Valor não encontrado
  });

  it('should have correct sexo options', () => {
    expect(component.sexoOptions).toEqual([
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' },
    ]);
  });

  it('should clear pessoa and error on submit', () => {
    component.pessoaEncontrada = mockPessoa;
    component.erroConsulta = 'Previous error';

    component.onSubmit();

    expect(component.pessoaEncontrada).toBeNull();
    expect(component.erroConsulta).toBeNull();
  });

  it('should display form header with correct properties', () => {
    const compiled = fixture.nativeElement;
    const formHeader = compiled.querySelector('app-form-header');

    expect(formHeader).toBeTruthy();
    expect(formHeader.getAttribute('icon')).toBe('search');
    expect(formHeader.getAttribute('title')).toBe('Consulta de Pessoa');
    expect(formHeader.getAttribute('subtitle')).toBe(
      'Digite o CPF para buscar uma pessoa cadastrada'
    );
  });

  it('should have submit button disabled when form is invalid', () => {
    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('button[type="submit"]');

    expect(submitButton.disabled).toBeTruthy();
  });

  it('should have submit button enabled when form is valid', () => {
    component.consultaForm.patchValue({ cpf: '123.456.789-01' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('button[type="submit"]');

    expect(submitButton.disabled).toBeFalsy();
  });

  it('should display person data when found', () => {
    component.pessoaEncontrada = mockPessoa;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const resultadoContainer = compiled.querySelector('.resultado-container');

    expect(resultadoContainer).toBeTruthy();
    expect(compiled.textContent).toContain('João Silva');
    expect(compiled.textContent).toContain('123.456.789-01');
    expect(compiled.textContent).toContain('Masculino');
    expect(compiled.textContent).toContain('joao@email.com');
    expect(compiled.textContent).toContain('(11) 99999-9999');
  });

  it('should display error message when error occurs', () => {
    component.erroConsulta = 'Test error message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const erroContainer = compiled.querySelector('.erro-container');

    expect(erroContainer).toBeTruthy();
    expect(compiled.textContent).toContain('Test error message');
  });

  it('should not display resultado container when no person found', () => {
    component.pessoaEncontrada = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const resultadoContainer = compiled.querySelector('.resultado-container');

    expect(resultadoContainer).toBeNull();
  });

  it('should not display error container when no error', () => {
    component.erroConsulta = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const erroContainer = compiled.querySelector('.erro-container');

    expect(erroContainer).toBeNull();
  });
});
