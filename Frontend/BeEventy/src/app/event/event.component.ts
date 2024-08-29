import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { EventCommunicationService } from '../services/event-communication.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input() event: any;
  lowestTicketPrice: number | undefined;
  emailOfLoggedUser$: Observable<string | null>;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private eventCommunicationService: EventCommunicationService
  ) { 
    this.emailOfLoggedUser$ = this.userService.getCurrentUserEmail();
  }

  ngOnInit(): void {
    this.eventService.getEventLowestPrice(this.event.id).subscribe(lowestPrice => {
      this.lowestTicketPrice = lowestPrice;
    });
    this.event.dateOfStart = this.eventCommunicationService.formatDateForInput(this.event.dateOfStart);
        this.event.dateOfEnd = this.eventCommunicationService.formatDateForInput(this.event.dateOfEnd);
        this.event.dateOfUpload = this.eventCommunicationService.formatDateForInput(this.event.dateOfUpload);

  }

  showDetails(): void {
    this.eventCommunicationService.navigateTo(`/event-details/${this.event.id}`, false);
  }

  reportThisEvent(): void {
    if (this.userService.isLoggedIn()) {
      this.emailOfLoggedUser$.subscribe(email => {
        if (email) {
          this.userService.getAccountByEmail(email).subscribe(
            user => {
              const token = localStorage.getItem('token');
              const loginResponse = { token: token || '', userId: user.id };
              if (!this.event.isReported) {
                this.eventService.reportEvent(this.event.id, loginResponse).subscribe(
                  updatedEvent => {
                    console.log('Event was reported:', updatedEvent);
                    this.event.isReported = true;
                    this.eventCommunicationService.updateEventInList(updatedEvent);
                  },
                  error => {
                    console.error('Error reporting event:', error);
                  }
                );
              } else {
                this.eventService.undoReportEvent(this.event.id, loginResponse).subscribe(
                  updatedEvent => {
                    console.log('Report was undone:', updatedEvent);
                    this.event.isReported = false;
                    this.eventCommunicationService.updateEventInList(updatedEvent);
                  },
                  error => {
                    console.error('Error undoing report:', error);
                  }
                );
              }
            },
            error => {
              console.error('Error fetching user account by email:', error);
            }
          );
        } else {
          this.eventCommunicationService.navigateTo('/login', false);
        }
      });
    } else {
      console.log("Użytkownik nie jest zalogowany, przekierowanie do logowania.");
      this.eventCommunicationService.navigateTo('/login', false);
    }
  }
  
  voteDown(): void {
    this.emailOfLoggedUser$.subscribe(email => {
      if (email) {
        this.userService.getAccountByEmail(email).subscribe(
          user => {
            const token = localStorage.getItem('token');
            const loginResponse = { token: token || '', userId: user.id };
            this.eventService.addMinus(this.event.id, loginResponse).subscribe(
              updatedEvent => {
                console.log('Minus added and event updated:', updatedEvent);
                this.event = updatedEvent;
                this.eventCommunicationService.updateEventInList(updatedEvent);
              },
              error => {
                console.error('Error adding minus:', error);
              }
            );
          },
          error => {
            console.error('Error fetching user account by email:', error);
          }
        );
      } else {
        this.eventCommunicationService.navigateTo('/login', false);
      }
    });
  }

  voteUp(): void {
    this.emailOfLoggedUser$.subscribe(email => {
        if (email) {
            this.userService.getAccountByEmail(email).subscribe(
                user => {
                    const token = localStorage.getItem('token');
                    const loginResponse = { token: token || '', userId: user.id };
                    this.eventService.addPlus(this.event.id, loginResponse).subscribe(
                        updatedEvent => {
                            console.log('Plus added and event updated:', updatedEvent);
                            this.event = updatedEvent;
                            this.eventCommunicationService.updateEventInList(updatedEvent);
                        },
                        error => {
                            console.error('Error adding plus:', error);
                        }
                    );
                },
                error => {
                    console.error('Error fetching user account by email:', error);
                }
            );
        } else {
          this.eventCommunicationService.navigateTo('/login', false);
        }
    });
}
  
  refreshEvent(): void {
    this.eventService.refreshEvent(this.event.id).subscribe(
      updatedEvent => {
        console.log('Event refreshed:', updatedEvent);
        this.event = updatedEvent;
        this.eventCommunicationService.updateEventInList(updatedEvent);
      },
      error => {
        console.error('Error refreshing event:', error);
      }
    );
  }
  
  getLocationImage(location: number): string {
    switch (location) {
      case 0:
        return 'assets/reallife.png';
      case 1:
        return 'assets/global.png';
      case 2:
        return 'assets/Hybrid.png';
      default:
        return 'assets/reallife.PNG';
    }
  }

  getLocationText(location: number): string {
    switch (location) {
      case 0:
        return 'Na miejscu';
      case 1:
        return 'Online';
      case 2:
        return 'Hybrydowo';
      default:
        return '';
    }
  }

  getImageStyle(event: any): any {
    const aspectRatio = event.image.width / event.image.height;
    if (aspectRatio > 1) {
      return 'landscape-image';
    } else if (aspectRatio < 1) {
      return 'portrait-image';
    } else {
      return 'square-image';
    }
  }

  getLocationImageStyle(location: number): any {
    if (location === 0) {
      return { width: '2vw' };
    } else {
      return { width: '3vw' };
    }
  }

  loadImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/events/default.PNG';
  }
}
