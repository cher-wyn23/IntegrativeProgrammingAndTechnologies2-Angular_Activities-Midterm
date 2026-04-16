export type AccountSnapshot = {
  name: string;
  username: string;
  password: string;
};

export type ValidationResult = {
  isValid: boolean;
  message: string;
};

// OOP Principle 1: Abstraction
// `AccountBase` defines the shared account behavior without exposing
// every implementation detail to the Angular component.
export abstract class AccountBase {
  protected displayName: string;
  private normalizedUsername: string;

  protected constructor(name: string, username: string, protected secretPassword: string) {
    this.displayName = name;
    this.normalizedUsername = this.normalizeUsername(username);
  }

  get name(): string {
    return this.displayName;
  }

  get username(): string {
    return this.normalizedUsername;
  }

  // OOP Principle 2: Encapsulation
  // Username normalization is controlled inside the class so the component
  // does not need to know how the value is stored internally.
  protected normalizeUsername(value: string): string {
    return value.trim().toLowerCase();
  }

  updateProfile(name: string, username: string, password: string) {
    this.displayName = name;
    this.normalizedUsername = this.normalizeUsername(username);
    this.secretPassword = password;
  }

  matchesPassword(password: string): boolean {
    return this.secretPassword === password.trim();
  }

  toSnapshot(): AccountSnapshot {
    return {
      name: this.name,
      username: this.username,
      password: this.secretPassword,
    };
  }

  abstract getRoleLabel(): string;
}

// OOP Principle 3: Inheritance
// `GuestAccount` reuses the common account behavior from `AccountBase`.
export class GuestAccount extends AccountBase {
  constructor(name: string, username: string, password: string) {
    super(name, username, password);
  }

  override getRoleLabel(): string {
    return 'Guest User';
  }
}

// OOP Principle 4: Polymorphism
// `AdminAccount` responds to the same `getRoleLabel()` message differently.
export class AdminAccount extends AccountBase {
  constructor(name: string, username: string, password: string) {
    super(name, username, password);
  }

  override getRoleLabel(): string {
    return 'Administrator';
  }
}

export class PasswordPolicy {
  private readonly passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  validate(value: string): ValidationResult {
    const isValid = this.passwordPattern.test(value.trim());

    return {
      isValid,
      message: isValid
        ? ''
        : 'Password must be at least 8 characters and contain: 1 capital letter, 1 number, and 1 special character.',
    };
  }
}

export class UserDirectory {
  private readonly accounts: GuestAccount[];

  // OOP Principle 5: Composition
  // `UserDirectory` owns the collection of `GuestAccount` objects.
  constructor(seedUsers: AccountSnapshot[]) {
    this.accounts = seedUsers.map(
      (user) => new GuestAccount(user.name, user.username, user.password)
    );
  }

  getAllSnapshots(): AccountSnapshot[] {
    return this.accounts.map((account) => account.toSnapshot());
  }

  getAt(index: number): GuestAccount | undefined {
    return this.accounts[index];
  }

  findByUsername(username: string): GuestAccount | undefined {
    const normalized = username.trim().toLowerCase();
    return this.accounts.find((account) => account.username === normalized);
  }

  isUsernameTaken(username: string, ignoredIndex: number | null = null): boolean {
    const normalized = username.trim().toLowerCase();

    return this.accounts.some(
      (account, index) => account.username === normalized && index !== ignoredIndex
    );
  }

  addUser(name: string, username: string, password: string) {
    this.accounts.push(new GuestAccount(name, username, password));
  }

  updateUser(index: number, name: string, username: string, password: string) {
    this.accounts[index]?.updateProfile(name, username, password);
  }

  removeUser(index: number): AccountSnapshot | null {
    const deleted = this.accounts.splice(index, 1)[0];
    return deleted ? deleted.toSnapshot() : null;
  }
}

export class AccountAuthenticator {
  // OOP Principle 6: Aggregation
  // The authenticator receives a directory created elsewhere and uses it,
  // but it does not own the directory's lifecycle.
  constructor(private readonly userDirectory: UserDirectory) {}

  authenticate(username: string, password: string): GuestAccount | null {
    const account = this.userDirectory.findByUsername(username);

    if (!account || !account.matchesPassword(password)) {
      return null;
    }

    return account;
  }
}
