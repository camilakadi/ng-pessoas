import { Routes } from '@angular/router';
import { PessoaConsultaComponent } from './components/pessoa-consulta/pessoa-consulta.component';

export const routes: Routes = [
  { path: '', component: PessoaConsultaComponent },
  { path: '**', redirectTo: '' },
];
