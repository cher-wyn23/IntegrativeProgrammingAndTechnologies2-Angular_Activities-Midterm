import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisteredUserRowComponent } from './components/registered-user-row/registered-user-row.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RegisteredUserRowComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  isRegisterMode = false;
  isLoggedIn = false;
  currentUserName = '';
  username = '';
  password = '';
  rememberMe = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  isSubmitting = false;

  message = '';
  error = '';

  registerName = '';
  registerUsername = '';
  registerPassword = '';
  confirmPassword = '';

  users = [
    {
      name: 'Cherwyn Malquisto',
      username: 'malquistocherwyn@gmail.com',
      password: '12345678',
    },
  ];

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPassword() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  switchMode(isRegisterMode: boolean) {
    this.isRegisterMode = isRegisterMode;
    this.clearFeedback();
    this.passwordVisible = false;
    this.confirmPasswordVisible = false;
  }

  clearFeedback() {
    if (this.message || this.error) {
      this.message = '';
      this.error = '';
    }
  }

  get canSubmit() {
    if (this.isRegisterMode) {
      return (
        this.registerName.trim() !== '' &&
        this.registerUsername.trim() !== '' &&
        this.registerPassword.trim() !== '' &&
        this.confirmPassword.trim() !== '' &&
        !this.isSubmitting
      );
    }

    return this.username.trim() !== '' && this.password.trim() !== '' && !this.isSubmitting;
  }

  onLogin() {
    if (!this.canSubmit) {
      this.message = '';
      this.error = 'Please enter your username and password.';
      return;
    }

    this.isSubmitting = true;
    const enteredUsername = this.username.trim().toLowerCase();
    const enteredPass = this.password.trim();
    const matchedUser = this.users.find((user) => user.username.toLowerCase() === enteredUsername);

    if (matchedUser && enteredPass === matchedUser.password) {
      this.error = '';
      this.message = `Welcome back, ${matchedUser.name}. Your Oceanic Retreats account is ready.`;
      this.isLoggedIn = true;
      this.currentUserName = matchedUser.name;
      this.isRegisterMode = false;
    } else {
      this.message = '';
      this.error = 'Invalid username or password. Please try again.';
      this.isLoggedIn = false;
      this.currentUserName = '';
    }

    this.isSubmitting = false;
  }

  onRegister() {
    if (!this.canSubmit) {
      this.message = '';
      this.error = 'Please complete all registration fields.';
      return;
    }

    this.isSubmitting = true;
    const name = this.registerName.trim();
    const username = this.registerUsername.trim().toLowerCase();
    const password = this.registerPassword.trim();
    const confirmPassword = this.confirmPassword.trim();

    if (password.length < 8) {
      this.message = '';
      this.error = 'Password must be at least 8 characters long.';
      this.isSubmitting = false;
      return;
    }

    if (password !== confirmPassword) {
      this.message = '';
      this.error = 'Passwords do not match.';
      this.isSubmitting = false;
      return;
    }

    if (this.users.some((user) => user.username.toLowerCase() === username)) {
      this.message = '';
      this.error = 'This username is already registered.';
      this.isSubmitting = false;
      return;
    }

    this.users.push({ name, username, password });

    this.username = username;
    this.password = password;
    this.registerName = '';
    this.registerUsername = '';
    this.registerPassword = '';
    this.confirmPassword = '';
    this.error = '';
    this.message = 'Registration successful. You can register another user below.';
    this.isSubmitting = false;
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUserName = '';
    this.username = '';
    this.password = '';
    this.rememberMe = false;
    this.switchMode(false);
  }
}