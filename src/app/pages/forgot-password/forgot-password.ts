import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  error = '';
  success = '';

  constructor(private auth: AuthService) {}

  submit() {
    if (!this.email) return;
    this.loading = true;
    this.error = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.success = 'E-mail enviado! Verifique sua caixa de entrada.';
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível enviar o e-mail. Verifique o endereço informado.';
        this.loading = false;
      }
    });
  }
}

