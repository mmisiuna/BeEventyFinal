import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5260/api/ticket';

  constructor(private http: HttpClient) { }

  getAllTickets(): Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      tap(data => console.log('fetched tickets', data)),
      catchError(this.handleError('getAllTickets', []))
    );
  }

  getTicketById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log(`fetched ticket id=${id}`, data)),
      catchError(this.handleError<any>(`getTicketById id=${id}`))
    );
  }

  getTicketsByEventId(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/${eventId}`).pipe(
        tap(data => console.log(`fetched tickets for event id=${eventId}`, data)),
        catchError(this.handleError<any>(`getTicketsByEventId eventId=${eventId}`))
    );
}

  addTicket(ticket: any): Observable<any> {
    return this.http.post(this.apiUrl, ticket).pipe(
      tap(data => console.log('added ticket', data)),
      catchError(this.handleError<any>('addTicket'))
    );
  }

  updateTicket(id: number, ticket: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ticket).pipe(
      tap(data => console.log(`updated ticket id=${id}`, data)),
      catchError(this.handleError<any>(`updateTicket id=${id}`))
    );
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log(`deleted ticket id=${id}`, data)),
      catchError(this.handleError<any>(`deleteTicket id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
