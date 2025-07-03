import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PessoaFormComponent } from './components/pessoa-form/pessoa-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PessoaFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ng-pessoas';
}
