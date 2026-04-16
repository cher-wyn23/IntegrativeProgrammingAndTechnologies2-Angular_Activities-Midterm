export type AccountRecord = {
  name: string;
  username: string;
  password: string;
};

export type ValidationResult = {
  isValid: boolean;
  message: string;
};

// OOP Principle 1: Abstraction
// This abstract class defines the common account behavior that the app uses.
export abstract class AccountBase {
  protected displayName: string;
  private normalizedUsername: string;
  private secretPassword: string;

  constructor(name: string, username: string, password: string) {
    this.displayName = name;
    this.normalizedUsername = this.normalizeUsername(username);
    this.secretPassword = password.trim();
  }

  get name(): string {
    return this.displayName;
  }

  get username(): string {
    return this.normalizedUsername;
  }

  // OOP Principle 2: Encapsulation
  // Username/password state is controlled inside the class instead of directly from the component.
  protected normalizeUsername(value: string): string {
    return value.trim().toLowerCase();
  }

  updateProfile(name: string, username: string, password: string) {
    this.displayName = name.trim();
    this.normalizedUsername = this.normalizeUsername(username);
    this.secretPassword = password.trim();
  }

  matchesPassword(password: string): boolean {
    return this.secretPassword === password.trim();
  }

  toRecord(): AccountRecord {
    return {
      name: this.name,
      username: this.username,
      password: this.secretPassword,
    };
  }

  abstract getRoleLabel(): string;
}

// OOP Principle 3: Inheritance
// GuestAccount reuses all shared behavior from AccountBase.
export class GuestAccount extends AccountBase {
  constructor(name: string, username: string, password: string) {
    super(name, username, password);
  }

  // OOP Principle 4: Polymorphism
  // This class gives its own role label implementation.
  override getRoleLabel(): string {
    return 'Guest User';
  }
}

// OOP Principle 4: Polymorphism
// AdminAccount responds to the same method with a different result.
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

  validate(password: string): ValidationResult {
    const isValid = this.passwordPattern.test(password.trim());

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
  // The directory owns and manages the GuestAccount objects inside it.
  constructor(seedUsers: AccountRecord[]) {
    this.accounts = seedUsers.map(
      (user) => new GuestAccount(user.name, user.username, user.password)
    );
  }

  getAllRecords(): AccountRecord[] {
    return this.accounts.map((account) => account.toRecord());
  }

  getUserAt(index: number): GuestAccount | undefined {
    return this.accounts[index];
  }

  addUser(name: string, username: string, password: string) {
    this.accounts.push(new GuestAccount(name, username, password));
  }

  updateUser(index: number, name: string, username: string, password: string) {
    this.accounts[index]?.updateProfile(name, username, password);
  }

  deleteUser(index: number): AccountRecord | null {
    const removed = this.accounts.splice(index, 1)[0];
    return removed ? removed.toRecord() : null;
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
}

export class AccountAuthenticator {
  // OOP Principle 6: Aggregation
  // This class uses UserDirectory from outside instead of creating/owning it.
  constructor(private readonly directory: UserDirectory) {}

  login(username: string, password: string): GuestAccount | null {
    const account = this.directory.findByUsername(username);

    if (!account || !account.matchesPassword(password)) {
      return null;
    }

    return account;
  }
}
