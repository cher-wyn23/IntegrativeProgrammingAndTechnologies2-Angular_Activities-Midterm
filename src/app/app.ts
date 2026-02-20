import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  username = '';
  password = '';

  passwordVisible = false; 

  message = '';
  error = '';

  correctUsername = 'JOHN ROQUE B. ABINA';
  correctPassword = '2023-00145'; 

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin() {
    const enteredUser = this.username.trim().toUpperCase();
    const correctUser = this.correctUsername.trim().toUpperCase();

    const enteredPass = this.password.trim();


    if (enteredUser === correctUser && enteredPass === this.correctPassword) {
      this.error = '';
      this.message =
        `Welcome, ${this.correctUsername}! You have successfully logged in. Have a productive learning experience in Integrative Programming and Technologies 2.`;
    } else {
      this.message = '';
      this.error = 'Invalid username or password. Please try again.';
    }
  }
}