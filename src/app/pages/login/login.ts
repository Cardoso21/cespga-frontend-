import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CardModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.username || !this.password) return;
    this.loading = true;
    this.error = '';

    this.auth.signin({ username: this.username, password: this.password }).subscribe({
      next: () => {
        sessionStorage.setItem('welcome', this.username);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Usuário ou senha incorretos.';
        this.loading = false;
      }
    });
  }
}
