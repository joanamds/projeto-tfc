export default class Validation {
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  validateEmail(): boolean {
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/i;
    if (!emailRegex.test(this.email)) {
      return false;
    }
    return true;
  }

  validatePassword() {
    if (this.password.length < 6) {
      return false;
    }
    return true;
  }
}
