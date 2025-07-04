import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { FormHeaderComponent } from './form-header.component';

describe('FormHeaderComponent', () => {
  let component: FormHeaderComponent;
  let fixture: ComponentFixture<FormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHeaderComponent, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.icon).toBe('');
    expect(component.title).toBe('');
    expect(component.subtitle).toBeUndefined();
  });

  it('should display icon when provided', () => {
    component.icon = 'person';
    fixture.detectChanges();

    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    expect(iconElement.textContent.trim()).toBe('person');
  });

  it('should display title when provided', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement.textContent.trim()).toBe('Test Title');
  });

  it('should display subtitle when provided', () => {
    component.subtitle = 'Test Subtitle';
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('p');
    expect(subtitleElement.textContent.trim()).toBe('Test Subtitle');
  });

  it('should not display subtitle when not provided', () => {
    component.subtitle = undefined;
    fixture.detectChanges();

    const subtitleElement = fixture.nativeElement.querySelector('p');
    expect(subtitleElement).toBeNull();
  });

  it('should display all properties when all are provided', () => {
    component.icon = 'search';
    component.title = 'Consulta';
    component.subtitle = 'Buscar informações';
    fixture.detectChanges();

    const iconElement = fixture.nativeElement.querySelector('mat-icon');
    const titleElement = fixture.nativeElement.querySelector('h2');
    const subtitleElement = fixture.nativeElement.querySelector('p');

    expect(iconElement.textContent.trim()).toBe('search');
    expect(titleElement.textContent.trim()).toBe('Consulta');
    expect(subtitleElement.textContent.trim()).toBe('Buscar informações');
  });

  it('should have correct CSS classes', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.card-header')).toBeTruthy();
    expect(compiled.querySelector('.header-content')).toBeTruthy();
    expect(compiled.querySelector('.title-section')).toBeTruthy();
    expect(compiled.querySelector('.title-icon')).toBeTruthy();
    expect(compiled.querySelector('.title-text')).toBeTruthy();
  });

  it('should have subtitle section when subtitle is provided', () => {
    component.subtitle = 'Test Subtitle';
    fixture.detectChanges();

    const subtitleSection =
      fixture.nativeElement.querySelector('.subtitle-section');
    expect(subtitleSection).toBeTruthy();
  });

  it('should not have subtitle section when subtitle is not provided', () => {
    component.subtitle = undefined;
    fixture.detectChanges();

    const subtitleSection =
      fixture.nativeElement.querySelector('.subtitle-section');
    expect(subtitleSection).toBeNull();
  });
});
