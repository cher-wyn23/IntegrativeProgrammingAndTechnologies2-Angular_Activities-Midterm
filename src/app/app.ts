import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisteredUserRowComponent } from './components/registered-user-row/registered-user-row.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import {
  AccountAuthenticator,
  AccountRecord,
  AdminAccount,
  PasswordPolicy,
  UserDirectory,
} from './core/account-oop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RegisteredUserRowComponent, AdminDashboardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // OOP Principle 7: Association
  // The component coordinates these OOP classes, while each class keeps its own job.
  private readonly passwordPolicy = new PasswordPolicy();
  private readonly userDirectory = new UserDirectory([
    {
      name: 'Cherwyn Malquisto',
      username: 'malquistocherwyn@gmail.com',
      password: '12345678',
    },
  ]);
  private readonly authenticator = new AccountAuthenticator(this.userDirectory);
  private readonly adminAccount = new AdminAccount('Oceanic Retreats Admin', 'admin@oceanicretreats.com', 'Admin@123');

  isRegisterMode = false;
  isLoggedIn = false;
  currentUserName = '';
  currentUserRole = '';
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
  editingUserIndex: number | null = null;
  searchTerm = '';

  private isEmailLike(value: string): boolean {
    return value.includes('@');
  }

  get users(): AccountRecord[] {
    // This is where the UI reads plain data records from the OOP directory class.
    return this.userDirectory.getAllRecords();
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

    if (!isRegisterMode) {
      this.editingUserIndex = null;
      this.resetRegisterForm();
    }
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

  resetRegisterForm() {
    this.registerName = '';
    this.registerUsername = '';
    this.registerPassword = '';
    this.confirmPassword = '';
    this.passwordVisible = false;
    this.confirmPasswordVisible = false;
  }

  get isEditingUser() {
    return this.editingUserIndex !== null;
  }

  get registerSubmitLabel() {
    if (this.isSubmitting) {
      return this.isEditingUser ? 'Updating Account...' : 'Creating Account...';
    }

    return this.isEditingUser ? 'Update Account' : 'Create Account';
  }

  get filteredUsers() {
    const keyword = this.searchTerm.trim().toLowerCase();

    return this.users
      .map((user, index) => ({ user, index }))
      .filter(({ user }) => !keyword || user.name.toLowerCase().includes(keyword));
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

    // This is where login is delegated to the OOP authenticator class.
    const matchedUser = this.authenticator.login(enteredUsername, enteredPass);

    if (matchedUser) {
      this.error = '';
      this.message = `Welcome back, ${matchedUser.name}. Your Oceanic Retreats account is ready.`;
      this.isLoggedIn = true;
      this.currentUserName = matchedUser.name;
      this.currentUserRole = `${matchedUser.getRoleLabel()} | ${this.adminAccount.getRoleLabel()}`;
      this.username = matchedUser.username;
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
      this.currentUserRole = '';
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

    // This is where the password policy class applies validation logic.
    const passwordValidation = this.passwordPolicy.validate(password);

    if (!passwordValidation.isValid) {
      this.message = '';
      this.error = '';
      this.registerUsernameError = '';
      this.registerPasswordError = passwordValidation.message;
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

    // This is where duplicate checking is delegated to the OOP directory class.
    if (this.userDirectory.isUsernameTaken(username, this.editingUserIndex)) {
      this.message = '';
      this.error = '';
      this.registerUsernameError = 'This username is already registered.';
      this.registerPasswordError = '';
      this.registerConfirmPasswordError = '';
      this.isSubmitting = false;
      return;
    }

    if (this.isEditingUser) {
      // This is where update CRUD uses the OOP directory class.
      this.userDirectory.updateUser(this.editingUserIndex!, name, username, password);
      this.message = 'Account updated successfully.';
    } else {
      // This is where create CRUD uses the OOP directory class.
      this.userDirectory.addUser(name, username, password);
      this.message = 'Registration successful. You can register another user below.';
    }

    this.username = username;
    this.password = password;
    this.error = '';
    this.showRegisterErrors = false;
    this.registerUsernameError = '';
    this.registerPasswordError = '';
    this.registerConfirmPasswordError = '';
    this.editingUserIndex = null;
    this.resetRegisterForm();
    this.isSubmitting = false;
  }

  editUser(index: number) {
    // This is where the component asks the OOP directory for one account object.
    const user = this.userDirectory.getUserAt(index);
    if (!user) {
      return;
    }

    this.editingUserIndex = index;
    this.isRegisterMode = true;
    this.registerName = user.name;
    this.registerUsername = user.username;
    this.registerPassword = user.toRecord().password;
    this.confirmPassword = user.toRecord().password;
    this.showRegisterErrors = false;
    this.clearFeedback();
  }

  cancelEdit() {
    this.editingUserIndex = null;
    this.showRegisterErrors = false;
    this.clearFeedback();
    this.resetRegisterForm();
  }

  deleteUser(index: number) {
    // This is where delete CRUD uses the OOP directory class.
    const userToDelete = this.userDirectory.deleteUser(index);
    if (!userToDelete) {
      return;
    }

    if (this.editingUserIndex === index) {
      this.cancelEdit();
    } else if (this.editingUserIndex !== null && this.editingUserIndex > index) {
      this.editingUserIndex -= 1;
    }

    this.message = `${userToDelete.name} was removed from registered users.`;
    this.error = '';
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUserName = '';
    this.currentUserRole = '';
    this.username = '';
    this.password = '';
    this.rememberMe = false;
    this.cancelEdit();
    this.switchMode(false);
  }
}