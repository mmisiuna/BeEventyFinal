import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventCommunicationService } from '../services/event-communication.service';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  isModeration: boolean = false;
  private subscriptions: Subscription[] = [];
  searchTerm: string = '';
  sortType: string = 'votes';
  events: any[] = [];

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private eventCommunicationService: EventCommunicationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.userService.isModeration$.subscribe(isModeration => {
        this.isModeration = isModeration;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  sortByDates(): void {
    this.sortType = 'date';
    this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getSortedEventsByDate());
    this.eventCommunicationService.notifySortChange();
  }

  sortByVotes(): void {
    this.sortType = 'votes';
    this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getSortedEventsByVotes());
    this.eventCommunicationService.notifySortChange();
  }

  sortByClosests(): void {
    this.sortType = 'closest';
    this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getSortedEventsByClosestDate());
    this.eventCommunicationService.notifySortChange();
  }

  getEventsToVerify(): void {
    this.sortType = 'reports';
    this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getEventsToVerify());
    this.eventCommunicationService.notifySortChange(); 
  }
}
