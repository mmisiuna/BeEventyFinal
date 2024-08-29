import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5260/api/account';
  currentUserEmail = new BehaviorSubject<string | null>(null);
  currentUserEmail$ = this.currentUserEmail.asObservable(); 
  currentUserImage = new BehaviorSubject<string | null>(null);
  currentUserImage$ = this.currentUserImage.asObservable();
  isModeration = new BehaviorSubject<boolean>(false);
  isModeration$ = this.isModeration.asObservable();
  isAdministrator = new  BehaviorSubject<boolean>(false);
  isAdministrator$ = this.isAdministrator.asObservable();
  private refreshUserDataSubject = new BehaviorSubject<void>(undefined);
  refreshUserData$ = this.refreshUserDataSubject.asObservable();
  
  constructor(private http: HttpClient) {}


  refreshUserData(): void {
    this.refreshUserDataSubject.next();
  }

  resetPassword(email: string): Observable<{ message: string, newPassword: string }> {
    return this.http.put<{ message: string, newPassword: string }>(`${this.apiUrl}/resetPassword/${email}`, {});
  }
  

  deactivateAccount(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/deactivate/${userId}`, {}, { responseType: 'text' });
  }
  
  getUserEmailById(userId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/emailbyid/${userId}`);
  }
  getAccountByEmail(email: string): Observable<any> {
    console.log(this.http.get<any>(`${this.apiUrl}/email/${email}`));
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }
  
  register(account: { name: string; email: string; password: string; phoneNumber: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, account);
  }
  getCurrentUserEmail(): Observable<string | null> {
    return this.currentUserEmail$;
  }
  emailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/email/${email}`);
  }
  getProfileImage(userId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/profileimage/${userId}`, { responseType: 'text' });
  }
  
  
  phoneNumberExists(phoneNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/phone/${phoneNumber}`);
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const email = this.currentUserEmail.getValue();
    return !!token && !!email;
  }

  updateAccount(account: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${account.id}`, account);
  }
  
  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap({
          next: response => {
            if (response.token) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('userId', response.userId.toString());
              this.currentUserEmail.next(email);
  
              this.getAccountByEmail(email).subscribe(account => {
                const isMod = account.accountType > 0;
                this.isModeration.next(isMod);
                const isAdmin = account.accountType == 2;
                this.isAdministrator.next(isAdmin);
              });
  
              this.getProfileImage(response.userId).subscribe(imageUrl => {
                this.currentUserImage.next(`assets/users/${imageUrl}`);
              });
            }
          },
          error: err => {
            if (err.status === 401) {
              if (err.error === 'This account has been deactivated. Please contact support.') {
                alert('This account has been deactivated. Please contact support.');
              } else {
                console.error('Login failed', err);
              }
            } else {
              console.error('Login failed', err);
            }
          }
        })
      );
  }
  

logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  this.currentUserEmail.next(null);
  this.currentUserImage.next(null);
  this.isModeration.next(false);
  console.log('User logged out');
}
grantPermission(userId: number, accountType: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/grantPermission/${userId}/${accountType}`, {}, { responseType: 'text' });
}
getUsers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/users`);
}

activateAccount(userId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/activate/${userId}`, {}, { responseType: 'text' });
}

requestForResetPassword(email: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/requestForResetPassword/${email}`, {}, { responseType: 'text' });
}

}

