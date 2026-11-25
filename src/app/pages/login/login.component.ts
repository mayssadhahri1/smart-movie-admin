import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  motPasse = '';
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login() {
    if (!this.email || !this.motPasse) {
      this.snackBar.open('Veuillez remplir tous les champs', '✕',
        { duration: 3000, panelClass: 'error-snack' });
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.motPasse).subscribe({
      next: (res) => {
        if (res.role !== 'ROLE_ADMIN') {
          this.snackBar.open('Accès réservé aux administrateurs', '✕',
            { duration: 3000, panelClass: 'error-snack' });
          this.loading = false;
          return;
        }
        this.authService.saveToken(res.token, res.role, res.nom);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.snackBar.open('Email ou mot de passe incorrect', '✕',
          { duration: 3000, panelClass: 'error-snack' });
        this.loading = false;
      }
    });
  }
}
