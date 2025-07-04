import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoaConsultaComponent } from './pessoa-consulta.component';

describe('PessoaConsultaComponent', () => {
  let component: PessoaConsultaComponent;
  let fixture: ComponentFixture<PessoaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaConsultaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
