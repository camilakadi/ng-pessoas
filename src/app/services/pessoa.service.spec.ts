import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';
import { PessoaService } from './pessoa.service';

describe('PessoaService', () => {
  let service: PessoaService;
  let httpMock: HttpTestingController;

  const mockPessoa: Pessoa = {
    id: 1,
    nome: 'João Silva Santos',
    cpf: '529.982.247-25',
    sexo: 'M',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
  };

  const mockPessoas: Pessoa[] = [
    mockPessoa,
    {
      id: 2,
      nome: 'Maria Oliveira Costa',
      cpf: '111.444.777-35',
      sexo: 'F',
      email: 'maria.oliveira@email.com',
      telefone: '(11) 88888-8888',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PessoaService],
    });
    service = TestBed.inject(PessoaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buscarTodas', () => {
    it('should return all pessoas', () => {
      service.buscarTodas().subscribe((pessoas) => {
        expect(pessoas).toEqual(mockPessoas);
      });

      const req = httpMock.expectOne('api/pessoas');
      expect(req.request.method).toBe('GET');
      req.flush(mockPessoas);
    });

    it('should handle empty response', () => {
      service.buscarTodas().subscribe((pessoas) => {
        expect(pessoas).toEqual([]);
      });

      const req = httpMock.expectOne('api/pessoas');
      req.flush([]);
    });
  });

  describe('buscarPorId', () => {
    it('should return pessoa by id', () => {
      service.buscarPorId(1).subscribe((pessoa) => {
        expect(pessoa).toEqual(mockPessoa);
      });

      const req = httpMock.expectOne('api/pessoas/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPessoa);
    });

    it('should handle pessoa not found', () => {
      service.buscarPorId(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('api/pessoas/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('buscarPorCPF', () => {
    it('should return pessoas by CPF', () => {
      const cpf = '543.134.150-25';
      service.buscarPorCPF(cpf).subscribe((pessoas) => {
        expect(pessoas).toEqual([mockPessoa]);
      });

      const req = httpMock.expectOne(`api/pessoas?cpf=${cpf}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockPessoa]);
    });

    it('should return empty array when CPF not found', () => {
      const cpf = '999.999.999-99';
      service.buscarPorCPF(cpf).subscribe((pessoas) => {
        expect(pessoas).toEqual([]);
      });

      const req = httpMock.expectOne(`api/pessoas?cpf=${cpf}`);
      req.flush([]);
    });
  });

  describe('verificarCPFExistente', () => {
    it('should return true when CPF exists', () => {
      const cpf = '543.134.150-25';
      service.verificarCPFExistente(cpf).subscribe((existe) => {
        expect(existe).toBe(true);
      });

      const req = httpMock.expectOne(`api/pessoas?cpf=${cpf}`);
      req.flush([mockPessoa]);
    });

    it('should return false when CPF does not exist', () => {
      const cpf = '999.999.999-99';
      service.verificarCPFExistente(cpf).subscribe((existe) => {
        expect(existe).toBe(false);
      });

      const req = httpMock.expectOne(`api/pessoas?cpf=${cpf}`);
      req.flush([]);
    });
  });

  describe('criar', () => {
    it('should create new pessoa', () => {
      const novaPessoa: Omit<Pessoa, 'id'> = {
        nome: 'Nova Pessoa',
        cpf: '111.222.333-99',
        sexo: 'F',
        email: 'nova@email.com',
        telefone: '(11) 11111-1111',
      };

      const pessoaCriada: Pessoa = { ...novaPessoa, id: 3 };

      service.criar(novaPessoa).subscribe((pessoa) => {
        expect(pessoa).toEqual(pessoaCriada);
      });

      const req = httpMock.expectOne('api/pessoas');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(novaPessoa);
      req.flush(pessoaCriada);
    });

    it('should handle creation error', () => {
      const novaPessoa: Omit<Pessoa, 'id'> = {
        nome: 'Nova Pessoa',
        cpf: '111.222.333-99',
        sexo: 'F',
        email: 'nova@email.com',
        telefone: '(11) 11111-1111',
      };

      service.criar(novaPessoa).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne('api/pessoas');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('atualizar', () => {
    it('should update existing pessoa', () => {
      const pessoaAtualizada: Pessoa = {
        ...mockPessoa,
        nome: 'João Silva Santos Atualizado',
        email: 'joao.atualizado@email.com',
      };

      service.atualizar(1, pessoaAtualizada).subscribe((pessoa) => {
        expect(pessoa).toEqual(pessoaAtualizada);
      });

      const req = httpMock.expectOne('api/pessoas/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(pessoaAtualizada);
      req.flush(pessoaAtualizada);
    });

    it('should handle update error', () => {
      service.atualizar(999, mockPessoa).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('api/pessoas/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletar', () => {
    it('should delete pessoa', () => {
      service.deletar(1).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('api/pessoas/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete error', () => {
      service.deletar(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne('api/pessoas/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('cpfUnicoValidator', () => {
    let control: AbstractControl;

    beforeEach(() => {
      control = new FormControl('');
    });

    it('should return null when control value is empty', (done) => {
      const validator = service.cpfUnicoValidator();
      const result = validator(control);

      expect(result).toBeInstanceOf(Observable);

      (result as Observable<any>).subscribe((validationResult: any) => {
        expect(validationResult).toBeNull();
        done();
      });
    });

    it('should return null when CPF does not exist', (done) => {
      control.setValue('111.222.333-96');
      const validator = service.cpfUnicoValidator();
      const result = validator(control);

      expect(result).toBeInstanceOf(Observable);

      (result as Observable<any>).subscribe((validationResult: any) => {
        expect(validationResult).toBeNull();
        done();
      });

      setTimeout(() => {
        const req = httpMock.expectOne('api/pessoas?cpf=111.222.333-96');
        req.flush([]);
      }, 600);
    });

    it('should return error when CPF already exists', (done) => {
      control.setValue('543.134.150-25');
      const validator = service.cpfUnicoValidator();
      const result = validator(control);

      expect(result).toBeInstanceOf(Observable);

      (result as Observable<any>).subscribe((validationResult: any) => {
        expect(validationResult).toEqual({ cpfJaExiste: true });
        done();
      });

      setTimeout(() => {
        const req = httpMock.expectOne('api/pessoas?cpf=543.134.150-25');
        req.flush([mockPessoa]);
      }, 600);
    });

    it('should handle HTTP error in validator', (done) => {
      control.setValue('529.982.247-25');
      const validator = service.cpfUnicoValidator();
      const result = validator(control);

      expect(result).toBeInstanceOf(Observable);

      (result as Observable<any>).subscribe({
        next: (validationResult: any) => {
          expect(validationResult).toBeNull();
          done();
        },
        error: () => {
          done();
        },
      });

      setTimeout(() => {
        const req = httpMock.expectOne('api/pessoas?cpf=529.982.247-25');
        req.flush('Server Error', {
          status: 500,
          statusText: 'Internal Server Error',
        });
      }, 600);
    });

    it('should have 500ms delay before validation', (done) => {
      const startTime = Date.now();
      control.setValue('529.982.247-25');
      const validator = service.cpfUnicoValidator();
      const result = validator(control);

      expect(result).toBeInstanceOf(Observable);

      (result as Observable<any>).subscribe(() => {
        const endTime = Date.now();
        const elapsed = endTime - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(450);
        done();
      });

      setTimeout(() => {
        const req = httpMock.expectOne('api/pessoas?cpf=529.982.247-25');
        req.flush([]);
      }, 600);
    });

    it('should return error when CPF is invalid', (done) => {
      control.setValue('111.111.111-11');
      const validator = service.cpfUnicoValidator();
      const result = validator(control);

      expect(result).toBeInstanceOf(Observable);

      (result as Observable<any>).subscribe((validationResult: any) => {
        expect(validationResult).toEqual({ cpfInvalido: true });
        done();
      });
    });
  });

  describe('URL construction', () => {
    it('should use correct base URL for all operations', () => {
      service.buscarTodas().subscribe();
      service.buscarPorId(1).subscribe();
      service.buscarPorCPF('529.982.247-25').subscribe();
      service.criar(mockPessoa).subscribe();
      service.atualizar(1, mockPessoa).subscribe();
      service.deletar(1).subscribe();

      const pessoasRequests = httpMock.match('api/pessoas');
      expect(pessoasRequests.length).toBe(2);
      pessoasRequests[0].flush([]);
      pessoasRequests[1].flush(mockPessoa);

      const pessoasIdRequests = httpMock.match('api/pessoas/1');
      expect(pessoasIdRequests.length).toBe(3);
      pessoasIdRequests[0].flush(mockPessoa);
      pessoasIdRequests[1].flush(mockPessoa);
      pessoasIdRequests[2].flush(null);

      const pessoasCpfRequests = httpMock.match(
        'api/pessoas?cpf=529.982.247-25'
      );
      pessoasCpfRequests.forEach((req, idx) => {
        req.flush([mockPessoa]);
      });
    });
  });

  describe('CPF validation', () => {
    describe('validarCPF', () => {
      it('should validate valid CPFs', () => {
        const validCPFs = [
          '529.982.247-25',
          '111.444.777-35',
          '987.654.321-00',
          '000.000.001-91',
        ];

        validCPFs.forEach((cpf) => {
          const isValid = service['validarCPF'](cpf);
          expect(isValid).toBe(true);
        });
      });

      it('should reject invalid CPFs', () => {
        const invalidCPFs = [
          '111.111.111-11', // Todos os dígitos iguais
          '123.456.789-10', // Dígitos verificadores incorretos
          '000.000.000-00', // Todos zeros
          '111.222.333-44', // CPF inválido
          '123.456.789-01', // CPF inválido
          '987.654.321-99', // CPF inválido
        ];

        invalidCPFs.forEach((cpf) => {
          expect(service['validarCPF'](cpf)).toBe(false);
        });
      });

      it('should handle CPFs without formatting', () => {
        expect(service['validarCPF']('52998224725')).toBe(true);
        expect(service['validarCPF']('11111111111')).toBe(false);
      });

      it('should reject CPFs with wrong length', () => {
        expect(service['validarCPF']('123.456.789-0')).toBe(false); // Muito curto
        expect(service['validarCPF']('123.456.789-000')).toBe(false); // Muito longo
      });
    });

    describe('cpfValidoValidator', () => {
      let control: AbstractControl;

      beforeEach(() => {
        control = new FormControl('');
      });

      it('should return null for empty value', () => {
        const validator = service.cpfValidoValidator();
        const result = validator(control);
        expect(result).toBeNull();
      });

      it('should return null for valid CPF', () => {
        control.setValue('529.982.247-25');
        const validator = service.cpfValidoValidator();
        const result = validator(control);
        expect(result).toBeNull();
      });

      it('should return error for invalid CPF', () => {
        control.setValue('111.111.111-11');
        const validator = service.cpfValidoValidator();
        const result = validator(control);
        expect(result).toEqual({ cpfInvalido: true });
      });

      it('should return error for CPF with wrong format', () => {
        expect(service['validarCPF']('123.456.789-10')).toBe(false);

        control.setValue('123.456.789-10');
        const validator = service.cpfValidoValidator();
        const result = validator(control);
        expect(result).toEqual({ cpfInvalido: true });
      });
    });
  });
});
