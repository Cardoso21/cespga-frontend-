import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink, CardModule, PasswordModule, ButtonModule, MessageModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  constructor(private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  submit() {
    if (!this.newPassword || !this.confirmPassword) return;
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'As senhas não coincidem.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.success = 'Senha redefinida com sucesso!';
        this.loading = false;
      },
      error: () => {
        this.error = 'Link inválido ou expirado.';
        this.loading = false;
      }
    });
  }
}
