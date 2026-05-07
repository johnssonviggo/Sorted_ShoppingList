import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }
  
  onLogin() {
    this.auth.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Invalid username or password';
      }
    })
  }
}
