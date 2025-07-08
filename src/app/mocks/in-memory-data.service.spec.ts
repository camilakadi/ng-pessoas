import { TestBed } from '@angular/core/testing';
import { Pessoa } from '../models/pessoa.model';
import { InMemoryDataService } from './in-memory-data.service';

describe('InMemoryDataService', () => {
  let service: InMemoryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryDataService],
    });
    service = TestBed.inject(InMemoryDataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should implement InMemoryDbService', () => {
    expect(service.createDb).toBeDefined();
    expect(typeof service.createDb).toBe('function');
  });

  describe('createDb', () => {
    let db: any;

    beforeEach(() => {
      db = service.createDb();
    });

    it('should return an object with pessoas property', () => {
      expect(db).toBeDefined();
      expect(db.pessoas).toBeDefined();
      expect(Array.isArray(db.pessoas)).toBe(true);
    });

    it('should return 11 pessoas in the array', () => {
      expect(db.pessoas.length).toBe(11);
    });

    it('should return pessoas with correct structure', () => {
      const pessoa = db.pessoas[0];

      expect(pessoa).toHaveProperty('id');
      expect(pessoa).toHaveProperty('nome');
      expect(pessoa).toHaveProperty('cpf');
      expect(pessoa).toHaveProperty('sexo');
      expect(pessoa).toHaveProperty('email');
      expect(pessoa).toHaveProperty('telefone');
    });

    it('should have pessoas with correct data types', () => {
      const pessoa = db.pessoas[0];

      expect(typeof pessoa.id).toBe('number');
      expect(typeof pessoa.nome).toBe('string');
      expect(typeof pessoa.cpf).toBe('string');
      expect(['M', 'F', 'O']).toContain(pessoa.sexo);
      expect(typeof pessoa.email).toBe('string');
      expect(typeof pessoa.telefone).toBe('string');
    });

    it('should have unique IDs for all pessoas', () => {
      const ids = db.pessoas.map((p: Pessoa) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(db.pessoas.length);
    });

    it('should have valid CPF format for all pessoas', () => {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

      db.pessoas.forEach((pessoa: Pessoa) => {
        expect(pessoa.cpf).toMatch(cpfRegex);
      });
    });

    it('should have valid email format for all pessoas', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      db.pessoas.forEach((pessoa: Pessoa) => {
        expect(pessoa.email).toMatch(emailRegex);
      });
    });

    it('should have valid phone format for all pessoas', () => {
      const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

      db.pessoas.forEach((pessoa: Pessoa) => {
        expect(pessoa.telefone).toMatch(phoneRegex);
      });
    });

    it('should have pessoas with different sexo values', () => {
      const sexos = db.pessoas.map((p: Pessoa) => p.sexo);
      const uniqueSexos = new Set(sexos);

      expect(uniqueSexos.size).toBeGreaterThan(1);
      expect(uniqueSexos.has('M')).toBe(true);
      expect(uniqueSexos.has('F')).toBe(true);
      expect(uniqueSexos.has('O')).toBe(true);
    });

    it('should have specific pessoa with known data', () => {
      const camilaKadi = db.pessoas.find(
        (p: Pessoa) => p.nome === 'Camila Kadi'
      );

      expect(camilaKadi).toBeDefined();
      expect(camilaKadi?.id).toBe(1);
      expect(camilaKadi?.cpf).toBe('543.134.150-25');
      expect(camilaKadi?.sexo).toBe('F');
      expect(camilaKadi?.email).toBe('camila.kadi@email.com');
      expect(camilaKadi?.telefone).toBe('(11) 99999-9999');
    });

    it('should have pessoa with sexo "O" (outro)', () => {
      const mariaJoao = db.pessoas.find(
        (p: Pessoa) => p.nome === 'Maria João Silva'
      );

      expect(mariaJoao).toBeDefined();
      expect(mariaJoao?.sexo).toBe('O');
    });
  });
});
