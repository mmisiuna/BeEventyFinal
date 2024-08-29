import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5260/api/event';
  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllValidEvents`);
  }
  
  getSortedEvents(sortType: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events?sort=${sortType}`);
  }
  
  getLowestTicketPrice(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${eventId}/lowest-price/`);
  }

  getHighestTicketPrice(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${eventId}/highestTicketPrice`);
  }

  getSortedEventsByDate(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sort/date`);
  }

  getSortedEventsByVotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sort/votes`);
  }

  getSortedEventsByClosestDate(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sort/closest`);
  }

  searchEvents(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params: { searchTerm } });
  }

  getEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id/${eventId}`);
  }
  
  addPlus(eventId: number, loginResponse: { token: string, userId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${eventId}/plus`, loginResponse).pipe(
        tap(response => {
            console.log('Response from server:', response);
        })
    );
  }

 addMinus(eventId: number, loginResponse: { token: string, userId: number }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/${eventId}/minus`, loginResponse).pipe(
    tap(response => {
      console.log('Response from server:', response);
    })
  );
}

getEventsToVerify(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/getEventsToVerify`);
}

refreshEvent(eventId: number): Observable<any> {
  console.log('refreshEvent called with:', eventId);
  return this.http.get<any>(`${this.apiUrl}/${eventId}`);
}

  getEventAuthor(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/author/${eventId}`);
  }

  getEventLowestPrice(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${eventId}/lowestTicketPrice`);
  }
  
  getEventHighestPrice(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${eventId}/highestTicketPrice`);
  }

  reportEvent(eventId: number, loginResponse: { token: string, userId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${eventId}/report`, loginResponse).pipe(
      tap(response => {
          console.log('Response from server:', response);
      })
    );
  }

  undoReportEvent(eventId: number, loginResponse: { token: string, userId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${eventId}/unreport`, loginResponse).pipe(
      tap(response => {
          console.log('Response from server:', response);
      })
    );
  }
  
  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`).pipe(
      tap(() => console.log(`Event with id ${eventId} deleted`)),
      catchError(error => {
        console.error('Error deleting event:', error);
        return of(void 0);
      })
    );
  }

  updateEvent(id: number | string, eventData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, eventData);
  }  

  searchAndSortEvents(searchTerm: string, sortType: string): Observable<any[]> {
    if (searchTerm.trim()) {
      const url = `${this.apiUrl}/searchAndSort?searchTerm=${encodeURIComponent(searchTerm)}&sortType=${encodeURIComponent(sortType)}`;
      return this.http.get<any[]>(url).pipe(
        catchError(error => {
          console.error('Error fetching sorted events:', error);
          return of([]);
        })
      );
    } else {
      switch (sortType) {
        case 'date':
          return this.getSortedEventsByDate();
        case 'votes':
          return this.getSortedEventsByVotes();
        case 'closest':
          return this.getSortedEventsByClosestDate();
        default:
          return this.getSortedEventsByDate();
      }
    }
  }

  getNextEventId(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/nextId`).pipe(
      tap(nextId => console.log('Next event ID:', nextId)),
      catchError(error => {
        console.error('Error fetching next event ID:', error);
        return of(0);
      })
    );
  }

  addEvent(event: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addEvent`, event).pipe(
      tap(response => console.log('Event added:', response)),
      catchError(error => {
        console.error('Error adding event:', error);
        return of(null);
      })
    );
  }
  
}
