import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss',
})
export class FormHeaderComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() subtitle?: string;
}
