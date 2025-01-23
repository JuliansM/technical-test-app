import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PhoneValidatorComponent} from './components/phone-validator/phone-validator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PhoneValidatorComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Phone Validator';
}
