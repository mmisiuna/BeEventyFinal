import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject, lastValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { EventCommunicationService } from '../services/event-communication.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-baner',
  templateUrl: './baner.component.html',
  styleUrls: ['./baner.component.css']
})
export class BanerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  events: any[] = [];
  searchTerm: string = '';
  userEmail: string = '';
  userImage: string = 'assets/users/default.PNG';
  isLoggedIn: boolean = false;
  isModeration: boolean = false;
  isAdministrator: boolean = false;
  searchPlaceholder: string = 'Wyszukaj wydarzenia...';
  userName : string ='';
  user : any;
  private searchTermSubject = new BehaviorSubject<string>('');
  private sortTypeSubject = new BehaviorSubject<string>('date');

  constructor(
    private router: Router,
    private userService: UserService,
    private eventCommunicationService: EventCommunicationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.userService.currentUserEmail$.subscribe(email => {
        this.userEmail = email || '';
        this.isLoggedIn = !!email;
        if (email) {
          this.userService.getAccountByEmail(email).subscribe(user => {
            this.user = user;
            this.userName = user.name;
          });
        }
      }),
      this.userService.currentUserImage$.subscribe(imageUrl => {
        this.userImage = imageUrl || 'assets/users/default.PNG';
      }),
      this.userService.isModeration$.subscribe(isModeration => {
        this.isModeration = isModeration;
      }),
      this.userService.isAdministrator$.subscribe(isAdministrator => {
        this.isAdministrator = isAdministrator;
      }),
      this.eventCommunicationService.currentEventList$.subscribe(events => {
        this.events = events;
      }),
      this.userService.refreshUserData$.subscribe(() => {
        this.refreshBannerData();
      }),
      this.searchTermSubject.pipe(
        switchMap(term => 
          this.sortTypeSubject.pipe(
            switchMap(async (sortType) => this.eventCommunicationService.requestEventListRefresh(
                () => this.eventCommunicationService.searchAndSortEvents(term, sortType)
              )
            )
          )
        )
      ).subscribe()
    );
  }
  navigateToAddingEvent(): void {
    this.hideAndNavigateTo('add-event');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  hideAndNavigateTo(path: string) {
    this.eventCommunicationService.navigateTo(path, false);
  }

  navigateTo(path: string) {
    this.eventCommunicationService.setSearchTerm('');
    this.eventCommunicationService.navigateTo(path, true);
  }

  async sortByVotes(): Promise<void> {
    const searchTerm = await lastValueFrom(this.eventCommunicationService.searchTerm$);

  }
  
  async searchEvents(): Promise<void> {
    const sortType = await lastValueFrom(this.eventCommunicationService.sortType$);
    this.eventCommunicationService.searchAndSortEvents(this.searchTerm, sortType).subscribe();
  }

  onSearchTermChange() {
    console.log("Current search term:", this.searchTerm);
    this.searchTermSubject.next(this.searchTerm);
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/events']);
  }

  loadImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/users/default.PNG';
  }

  loadMainPage(): void {
    this.navigateTo('events');
    this.searchTerm = "";
    this.eventCommunicationService.requestEventListRefresh(() => this.eventService.getSortedEventsByVotes());
  }

  refreshBannerData(): void {
    const email = this.userService.currentUserEmail.getValue();
    if (email) {
      this.userService.getAccountByEmail(email).subscribe(user => {
        this.user = user;
        this.userName = user.name;
      });
      this.userService.getProfileImage(parseInt(localStorage.getItem('userId') || '0')).subscribe(imageUrl => {
        this.userImage = imageUrl ? `assets/users/${imageUrl}` : 'assets/users/default.PNG';
      });
    }
  }
}
