import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationData = {
    name: '',
    email: '',
    password: '',
    repeatedPassword: '',
    phoneNumber: ''
  };
  regex = /^(\s*[+\d]+\s*)*$/;
  emailError: string | null = null;
  phoneNumberError: string | null = null;
  passwordError: string | null = null;
  isEmailInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isRepeatedPasswordInvalid: boolean = false;
  isPhoneNumberInvalid: boolean = false;

  constructor(private userService: UserService, private http: HttpClient) {}

  validateEmail(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.registrationData.email)) {
      this.emailError = 'Nieprawidłowy format email.';
      this.isEmailInvalid = true;
    } else {
      this.userService.emailExists(this.registrationData.email).subscribe(exists => {
        this.emailError = exists ? 'Adres email jest już używany.' : null;
        this.isEmailInvalid = exists;
      });
    }
  }

  validatePhoneNumber(): void {
    if (this.registrationData.phoneNumber.trim() === '') {
      this.phoneNumberError = 'Numer telefonu jest wymagany.';
      this.isPhoneNumberInvalid = true;
    } else if (!this.regex.test(this.registrationData.phoneNumber)) {
      this.phoneNumberError = 'Numer telefonu musi składać się z cyfr i ewentualnie plusa.';
      this.isPhoneNumberInvalid = true;
    } else {
      this.userService.phoneNumberExists(this.registrationData.phoneNumber).subscribe(exists => {
        this.phoneNumberError = exists ? 'Numer telefonu jest już używany.' : null;
        this.isPhoneNumberInvalid = exists;
      });
    }
  }

  validatePasswordMatch(): void {
    this.passwordError = this.registrationData.password === this.registrationData.repeatedPassword
      ? null
      : 'Hasła muszą być takie same.';
    this.isPasswordInvalid = !!this.passwordError;
    this.isRepeatedPasswordInvalid = !!this.passwordError;
  }

  allValid(): boolean {
    return !this.emailError && !this.phoneNumberError && !this.passwordError;
  }

  onSubmit(): void {
    this.userService.emailExists(this.registrationData.email).subscribe(emailExists => {
      this.emailError = emailExists ? 'Adres email jest już używany.' : null;
      this.isEmailInvalid = emailExists;
      this.userService.phoneNumberExists(this.registrationData.phoneNumber).subscribe(phoneExists => {
        this.phoneNumberError = phoneExists ? 'Numer telefonu jest już używany.' : null;
        this.isPhoneNumberInvalid = phoneExists;
        if (!this.emailError && !this.phoneNumberError && !this.passwordError) {
          this.userService.register(this.registrationData).subscribe(
            response => {
              console.log('Account created:', response);
            },
            error => {
              console.error('Error creating account:', error);
            }
          );
        }
      });
    });
  }
}
