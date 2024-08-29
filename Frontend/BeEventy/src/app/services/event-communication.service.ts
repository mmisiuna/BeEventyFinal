import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, Subject, tap } from 'rxjs';
import { UserService } from './user.service';
import { EventService } from './event.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventCommunicationService {
  private apiUrl = 'http://localhost:5260/api/event';
  private refreshEventListSource = new Subject<() => Observable<any[]>>();
  refreshEventList$ = this.refreshEventListSource.asObservable();
  private isEditModeSubject = new BehaviorSubject<boolean>(false);
  isEditMode$ = this.isEditModeSubject.asObservable();
  showNavbar = new BehaviorSubject<boolean | null>(null);
  currentUserEmail$ = this.showNavbar.asObservable(); 
  private updateEventInListSource = new Subject<any>();
  updateEventInList$ = this.updateEventInListSource.asObservable();
  private sortTypeSubject = new BehaviorSubject<string>('votes');
  sortType$ = this.sortTypeSubject.asObservable();
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  private currentSortSubject = new BehaviorSubject<string>('votes');
  currentSort$ = this.currentSortSubject.asObservable();
  private currentEventListSubject = new BehaviorSubject<any[]>([]);
  currentEventList$ = this.currentEventListSubject.asObservable();
  private sortChangedSubject = new BehaviorSubject<void | null>(null);
  sortChanged$: Observable<void | null> = this.sortChangedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private eventService: EventService) {}

  requestEventListRefresh(sortMethod: () => Observable<any[]>): void {
    this.refreshEventListSource.next(sortMethod);
  }

  searchAndSortEvents(searchTerm: string, sortType: string): Observable<Event[]> {
    const url = `${this.apiUrl}/searchAndSort?searchTerm=${encodeURIComponent(searchTerm)}&sortType=${encodeURIComponent(sortType)}`;
    return this.http.get<Event[]>(url).pipe(
        catchError(error => of([]))
    );
  }

  getEvents(searchTerm: string, sortType: string): Observable<any[]> {
    return this.eventService.getSortedEvents(sortType).pipe(
      catchError(error => {
        console.error('Error fetching events:', error);
        return of([]);
      })
    );
  }

  notifySortChange() {
    this.sortChangedSubject.next();
  }

  setSearchTerm(searchTerm: string): void {
    console.log('Setting search term:', searchTerm);
    this.searchTermSubject.next(searchTerm);
  }

  navigateTo(path: string, showNavBar: boolean) {
    if (showNavBar){
      this.showNavBar();
      this.router.navigate([path]);
    }
    else {
      this.hideNavBar();
      this.router.navigate([path]);
    }
  }

  hideNavBar() {
    const navBar = document.getElementById('navigation-bar');
    const footer = document.getElementById('footer');
    if (navBar) {
      navBar.style.display = 'none';
    }
    if (footer) {
      footer.style.display = 'none';
    }
  }

  showNavBar() {
    const navBar = document.getElementById('navigation-bar');
    const footer = document.getElementById('footer');
    if (navBar) {
      navBar.style.display = 'block';
    }
    if (footer) {
      footer.style.display = 'block';
    }
  }

  updateEventInList(event: any): void {
    console.log('updateEventInList called with:', event);
    this.updateEventInListSource.next(event);
  }

  setSortType(sortType: string): void {
    this.sortTypeSubject.next(sortType);
  }

  toggleEditMode(isEditMode: boolean): void {
    this.isEditModeSubject.next(isEditMode);
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }
}

