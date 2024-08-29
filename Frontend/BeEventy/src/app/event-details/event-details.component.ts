import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { EventCommunicationService } from '../services/event-communication.service';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { DistributorService } from '../services/distributor.service';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: any;
  lowestTicketPrice: number | undefined;
  highestTicketPrice: number | undefined;
  user: any;
  authorName: string | undefined;
  emailOfLoggedUser$: Observable<string | null>;
  isModeration: boolean = false;
  distributorAddress: string | undefined; 
  ticketCounts = Array.from({ length: 10 }, (_, i) => i + 1);
  isEditMode = false;
  eventData: any = {
    id: 0,
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
    authorId: 0,
    distributorId: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private distributorService: DistributorService,
    private eventCommunicationService: EventCommunicationService
  ) {this.emailOfLoggedUser$ = this.userService.getCurrentUserEmail();}
  loadEventData(): void {
    const eventId = +this.route.snapshot.paramMap.get('id')!;
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe(data => {
        this.eventData = data;
        console.log("eventData" + this.eventData);
      });
    }
  }
  ngOnInit(): void {
    this.loadEventData();
    const eventId = +this.route.snapshot.paramMap.get('id')!;
    this.eventService.getEventById(eventId).subscribe(
      data => {
        this.event = data;
        console.log("event" +this.event);
        this.user = data.user;
        this.eventService.getEventLowestPrice(eventId).subscribe(lowestPrice => {
          this.lowestTicketPrice = lowestPrice;
        });      
        this.eventData.dateOfStart = this.eventCommunicationService.formatDateForInput(this.eventData.dateOfStart);
        this.eventData.dateOfEnd = this.eventCommunicationService.formatDateForInput(this.eventData.dateOfEnd);
        this.eventData.dateOfUpload = this.eventCommunicationService.formatDateForInput(this.eventData.dateOfUpload);
        this.userService.isModeration$.subscribe(isModeration => {
          this.isModeration = isModeration;
        });

        this.eventService.getEventHighestPrice(eventId).subscribe(highestPrice => {
          this.highestTicketPrice = highestPrice;
        });

        this.eventService.getEventAuthor(eventId).subscribe(authorData => {
          this.authorName = authorData.name;
        });
        console.log(this.event);
        if (this.event.distributorId) {
          this.distributorService.getDistributorById(this.event.distributorId).subscribe(
            distributor => {
              console.log(distributor);
              this.distributorAddress = distributor.searchAdress;
              console.log(this.distributorAddress);
            },
            error => {
              console.error('Error fetching distributor:', error);
            }
          );
        }
      },
      error => {
        console.error('Error fetching event details:', error);
        this.event = {};
      }
    );
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

  saveChanges(): void {
    const eventId = this.eventData.id;
    if (eventId) {
      this.eventService.updateEvent(eventId, this.eventData).subscribe(
        response => {
          this.isEditMode = false;
          this.loadEventData();
          this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getSortedEventsByVotes());
        },
        error => {
          console.error('Error updating event:', error);
        }
      );
    } else {
      console.error('Event ID is missing.');
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

openDistributorPage(): void {
  if (this.distributorAddress) {
    if (this.event?.name) {
      const url = `${this.distributorAddress}${this.event.name}`;
      window.open(url, '_blank');
    } else {
      console.error('Event name is not available');
    }
  } else {
    console.error('Distributor address is not available');
  }
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

  loadImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/events/default.PNG';
  }

  goBack(): void {
    this.eventCommunicationService.navigateTo('events', true);
    this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getSortedEventsByVotes());
  }

  getImageStyle(event: any): string {
    const aspectRatio = event.image.width / event.image.height;
    if (aspectRatio > 1) {
      return 'landscape-image';
    } else if (aspectRatio < 1) {
      return 'portrait-image';
    } else {
      return 'square-image';
    }
  }
  
  cancelEdit(): void {
    this.isEditMode = !this.isEditMode;
    this.eventCommunicationService.toggleEditMode(this.isEditMode);
    this.loadEventData();
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.eventCommunicationService.toggleEditMode(this.isEditMode);
  }
  deleteEvent(): void {
    if (confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
      this.eventService.deleteEvent(this.event.id).subscribe(() => {
        this.eventCommunicationService.navigateTo('events', true);
        this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getSortedEventsByVotes());
      });
    }
  }
}
