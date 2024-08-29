import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import { DistributorService } from '../services/distributor.service';
import { EventCommunicationService } from '../services/event-communication.service';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  eventData: any;
  isEditMode = false;
  eventId: number = 0; 
  tickets: any[] = [];
  ticketData: any = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    eventId: 0,
  }
  newTicket: any = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    eventId: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private distributorService: DistributorService,
    private eventCommunicationService: EventCommunicationService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
    this.eventCommunicationService.isEditMode$.subscribe(isEditMode => {
      this.isEditMode = isEditMode;
    });
  }

  addTicket(ticket: any): void {
    this.ticketService.addTicket(ticket);
  }

  loadEventData(): void {
    const eventId = +this.route.snapshot.paramMap.get('id')!;
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe(data => {
        this.eventData = data;
        console.log("eventData" + this.eventData);
        this.ticketData.eventId=this.eventData.id;
      });
    }
  }
  
  loadTickets(): void {
    const eventId = +this.route.snapshot.paramMap.get('id')!;
    if (eventId) {
        this.eventId = eventId;
        this.ticketService.getTicketsByEventId(eventId).subscribe(
            tickets => {
                console.log("Tickets received: ", tickets);
                this.tickets = tickets.map((ticket: any) => {
                    ticket.date = this.formatDateForInput(ticket.date);
                    return ticket;
                });
            },
            error => console.error('Error loading tickets', error)
        );
    }
  }

  addNewTicket(): void {
    this.newTicket.eventId = this.eventId;
    this.ticketService.addTicket(this.newTicket).subscribe(() => {
      this.loadTickets();
      this.resetNewTicketData();
    });
  }
  resetNewTicketData(): void {
    this.newTicket = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      eventId: this.eventId,
    };
  }

  deleteTicket(ticketId: number): void {
    if (confirm('Czy na pewno chcesz usunąć ten bilet?')) {
      this.ticketService.deleteTicket(ticketId).subscribe(() => {
        this.loadTickets();
      });
    }
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toISOString().slice(0, 16);
    } else {
        console.error(`Invalid date: ${dateString}`);
        return '';
    }
}

  saveTicket(ticket: any): void {
    if (ticket.id) {
      this.ticketService.updateTicket(ticket.id, ticket).subscribe(() => {
        this.loadTickets();
      });
    } else {
      this.ticketService.addTicket(ticket).subscribe(() => {
        this.loadTickets();
      });
    }
  }

  cancelEdit(): void {
    this.loadTickets();
  }
}
