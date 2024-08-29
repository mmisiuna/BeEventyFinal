import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  user: any = {
    id: 0,
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    activeAccount: true,
    accountType: 0,
  };
  event: any = {
    id: 90,
    name: '',
    dateOfStart: '',
    dateOfEnd: '',
    dateOfUpload: '',
    description: '',
    location: 0,
    address: '',
    image: '',
    pluses: 0,
    minuses: 0,
    amountOfAllTickets: 0,
    ammountOfBatches: 0,
    isConfirmed: false,
    numberOfReports: 0,
    isSoldOut: false,
    isExpired: false,
    eventStatus: 0,
    eventType: 0,
    authorId: this.user.id,
    distributorId: 1,
  };
  emailOfLoggedUser$: Observable<string | null>;
  email: string ="";
  selectedFile: File | null = null;

  constructor(private eventService: EventService,
    private router: Router,
    private userService: UserService) {
    this.emailOfLoggedUser$ = this.userService.getCurrentUserEmail();
  }

  convertToDatetimeLocalFormat(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    const timeZoneOffset = '+02:00';
    const dateOfStart = new Date(this.event.dateOfStart);
    const dateOfEnd = new Date(this.event.dateOfEnd);
    const dateOfUpload = new Date();
    this.event.dateOfStart = this.convertToDatetimeLocalFormat(new Date(this.event.dateOfStart));
    this.event.dateOfEnd = this.convertToDatetimeLocalFormat(new Date(this.event.dateOfEnd));
    this.event.dateOfUpload = this.convertToDatetimeLocalFormat(new Date());
    this.eventService.getNextEventId().subscribe(nextId => {
      this.event.id = nextId;
      console.log('Wysyłane dane:', this.event);
      this.eventService.addEvent(this.event).subscribe(
        response => {
          console.log('Event added successfully', response);
          this.router.navigate(['/events']);
        },
        error => {
          console.error('Error adding event', error);
        }
      );
    });
    this.emailOfLoggedUser$.subscribe(email => {
      if (email) {
    this.userService.getAccountByEmail(email).subscribe(
      user => {
        const token = localStorage.getItem('token');
        const loginResponse = { token: token || '', userId: user.id };
        this.user = user;
          }
        );
      }
    })
  }
}
