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

  showRegisterErrors = false;
  showLoginErrors = false;
  registerUsernameError = '';
  registerPasswordError = '';
  registerConfirmPasswordError = '';
  loginUsernameError = '';
  loginPasswordError = '';

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

  private isEmailLike(value: string): boolean {
    return value.includes('@');
  }

  private isPasswordValid(value: string): boolean {
    // UI validation only:
    // - min 8 chars
    // - at least one capital letter
    // - at least one number
    // - at least one special character
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPassword() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  switchMode(isRegisterMode: boolean) {
    this.isRegisterMode = isRegisterMode;
    this.showRegisterErrors = false;
    this.showLoginErrors = false;
    this.clearFeedback();
    this.passwordVisible = false;
    this.confirmPasswordVisible = false;
  }

  clearFeedback() {
    this.message = '';
    this.error = '';
    this.registerUsernameError = '';
    this.registerPasswordError = '';
    this.registerConfirmPasswordError = '';
    this.loginUsernameError = '';
    this.loginPasswordError = '';
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
    this.showLoginErrors = true;
    if (!this.canSubmit) {
      this.message = '';
      this.error = '';
      this.loginUsernameError = this.username.trim() ? '' : 'Username is required.';
      this.loginPasswordError = this.password.trim() ? '' : 'Password is required.';
      this.isSubmitting = false;
      return;
    }

    this.isSubmitting = true;
    const enteredUsername = this.username.trim().toLowerCase();
    const enteredPass = this.password.trim();

    if (!this.isEmailLike(enteredUsername)) {
      this.message = '';
      this.error = '';
      this.loginUsernameError = 'Username must be a valid email address (must contain @).';
      this.loginPasswordError = '';
      this.isSubmitting = false;
      return;
    }

    const matchedUser = this.users.find((user) => user.username.toLowerCase() === enteredUsername);

    if (matchedUser && enteredPass === matchedUser.password) {
      this.error = '';
      this.message = `Welcome back, ${matchedUser.name}. Your Oceanic Retreats account is ready.`;
      this.isLoggedIn = true;
      this.currentUserName = matchedUser.name;
      this.showLoginErrors = false;
      this.loginUsernameError = '';
      this.loginPasswordError = '';
      this.isRegisterMode = false;
    } else {
      this.message = '';
      this.error = '';
      this.loginUsernameError = '';
      this.loginPasswordError = 'Invalid username or password. Please try again.';
      this.isLoggedIn = false;
      this.currentUserName = '';
    }

    this.isSubmitting = false;
  }

  onRegister() {
    this.showRegisterErrors = true;
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

    if (!this.isEmailLike(username)) {
      this.message = '';
      this.error = '';
      this.registerUsernameError = 'Username must be a valid email address (must contain @).';
      this.registerPasswordError = '';
      this.registerConfirmPasswordError = '';
      this.isSubmitting = false;
      return;
    }

    if (!this.isPasswordValid(password)) {
      this.message = '';
      this.error = '';
      this.registerUsernameError = '';
      this.registerPasswordError =
        'Password must be at least 8 characters and contain: 1 capital letter, 1 number, and 1 special character.';
      this.registerConfirmPasswordError = '';
      this.isSubmitting = false;
      return;
    }

    if (password !== confirmPassword) {
      this.message = '';
      this.error = '';
      this.registerConfirmPasswordError = 'Passwords do not match.';
      this.registerUsernameError = '';
      this.registerPasswordError = '';
      this.isSubmitting = false;
      return;
    }

    if (this.users.some((user) => user.username.toLowerCase() === username)) {
      this.message = '';
      this.error = '';
      this.registerUsernameError = 'This username is already registered.';
      this.registerPasswordError = '';
      this.registerConfirmPasswordError = '';
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
    this.showRegisterErrors = false;
    this.registerUsernameError = '';
    this.registerPasswordError = '';
    this.registerConfirmPasswordError = '';
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