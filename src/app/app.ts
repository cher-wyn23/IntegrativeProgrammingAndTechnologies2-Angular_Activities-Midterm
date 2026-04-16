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
  isLoggedIn = false;
  currentUserName = '';
  email = '';
  password = '';
  rememberMe = false;
  passwordVisible = false;
  isSubmitting = false;

  message = '';
  error = '';

  correctEmail = 'cherwyn@gmail.com';
  correctPassword = '12345678'; 

  private formatDisplayName(email: string): string {
    const localPart = email.split('@')[0] ?? 'Guest';
    return localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  clearFeedback() {
    if (this.message || this.error) {
      this.message = '';
      this.error = '';
    }
  }

  get canSubmit() {
    return this.email.trim() !== '' && this.password.trim() !== '' && !this.isSubmitting;
  }

  onLogin() {
    if (!this.canSubmit) {
      this.message = '';
      this.error = 'Please enter your email and password.';
      return;
    }

    this.isSubmitting = true;
    const enteredEmail = this.email.trim().toLowerCase();
    const correctEmail = this.correctEmail.trim().toLowerCase();
    const enteredPass = this.password.trim();

    if (enteredEmail === correctEmail && enteredPass === this.correctPassword) {
      this.error = '';
      this.message = 'Welcome back to Oceanic Retreats. Your coastal getaway dashboard is ready.';
      this.isLoggedIn = true;
      this.currentUserName = this.formatDisplayName(enteredEmail);
    } else {
      this.message = '';
      this.error = 'Invalid email or password. Please try again.';
      this.isLoggedIn = false;
      this.currentUserName = '';
    }

    this.isSubmitting = false;
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUserName = '';
    this.email = '';
    this.password = '';
    this.rememberMe = false;
    this.passwordVisible = false;
    this.clearFeedback();
  }
}