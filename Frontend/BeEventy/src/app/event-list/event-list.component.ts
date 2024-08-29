import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventCommunicationService } from '../services/event-communication.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  events: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(
    private eventService: EventService,
    private eventCommunicationService: EventCommunicationService
  ) {}
  
  ngOnInit() {
    this.loadEvents();
    this.subscriptions.push(
      this.eventCommunicationService.refreshEventList$.subscribe(sortMethod => {
        sortMethod().subscribe(data => {
          this.events = data;
          this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
          this.currentPage = 1;
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadEvents() {
    this.eventService.getSortedEventsByVotes().subscribe(data => {
      this.events = data;
      this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    });

  }
  getSortedEventsByVotes (){
    this.eventService.getSortedEventsByVotes().subscribe(data => {
      this.events = data;
      this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    });
  }
  updateEventInList(updatedEvent: any) {
    const index = this.events.findIndex(event => event.id === updatedEvent.id);
    if (index !== -1) {
      this.events[index] = updatedEvent;
    }
  }

  get paginatedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.events.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
