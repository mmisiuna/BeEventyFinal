import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  toggleActive(user: any): void {
    if (user.activeAccount) {
      this.userService.deactivateAccount(user.id).subscribe(() => {
        user.activeAccount = false;
      });
    } else {
      this.userService.activateAccount(user.id).subscribe(() => {
        user.activeAccount = true;
      });
    }
  }
  
  resetPassword(email: string): void {
    this.userService.resetPassword(email).subscribe({
      next: (response) => {
        const newPassword = response.newPassword;
        navigator.clipboard.writeText(newPassword).then(() => {
          alert(`Hasło dla użytkownika ${email} zostało zresetowane i skopiowane do schowka: ${newPassword}`);
        }).catch(err => {
          console.error('Błąd podczas kopiowania hasła do schowka:', err);
          alert(`Hasło dla użytkownika ${email} zostało zresetowane, ale nie udało się skopiować go do schowka. Nowe hasło: ${newPassword}`);
        });
      },
      error: (err) => {
        console.error('Błąd podczas resetowania hasła:', err);
        alert('Wystąpił błąd podczas resetowania hasła.');
      }
    });
  }
  
  loadImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/users/default.PNG';
  }

  changePermission(user: any, accountType: number): void {
    this.userService.grantPermission(user.id, accountType).subscribe(() => {
      user.accountType = accountType;
    });
  }
}
