import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { EventCommunicationService } from '../services/event-communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private userService: UserService, 
    private router: Router,
    private eventCommunicationService: EventCommunicationService) {}

  login() {
    this.userService.login(this.email, this.password).subscribe(
      response => {
        console.log(`Hello ${this.email}!`);
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString());
        this.userService.currentUserEmail.next(this.email);
        this.eventCommunicationService.navigateTo('/events', true);
      },
      error => {  
        console.error('Login failed', error);
      }
    );
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  resetPassword(email: string) {
    this.userService.requestForResetPassword(email).subscribe(
      response => {
        console.log('Password reset request sent successfully', response);
        alert(`A reset link has been sent to ${email}. Please check your email.`);
      },
      error => {
        console.error('Password reset failed', error);
        alert(`Failed to send reset link. Please try again.`);
      }
    );
  }
}
