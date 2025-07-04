import { Routes } from '@angular/router';
import { PessoaConsultaComponent } from './components/pessoa-consulta/pessoa-consulta.component';
import { PessoaFormComponent } from './components/pessoa-form/pessoa-form.component';

export const routes: Routes = [
  { path: '', component: PessoaConsultaComponent },
  { path: 'cadastro', component: PessoaFormComponent },
  { path: '**', redirectTo: '' },
];
