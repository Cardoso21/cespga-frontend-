import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [NgIf, FormsModule, RouterLink],
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

