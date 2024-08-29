import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  isEditMode = false;
  userData: any = {
    id: 0,
    name: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    activeAccount: true,
    accountType: 0,
  };
  selectedFile: File | null = null;
  constructor(private userService: UserService,
         private router: Router,) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userEmail = this.userService.currentUserEmail.getValue();
    if (userEmail) {
      this.userService.getAccountByEmail(userEmail).subscribe(data => {
        this.userData = data;
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.userData.profileImage = file.name;
    }
  }

  saveChanges(): void {
    this.userService.updateAccount(this.userData).subscribe(
      response => {
        this.isEditMode = false;
        this.loadUserData();
        this.userService.refreshUserData();
      },
      error => {
        console.error('Error updating account:', error);
      }
    );
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
 
  deactivateUser(userId: number): void {
    this.userService.deactivateAccount(userId).subscribe(
      (response: any) => {
        console.log(response.message || 'Account deactivated successfully');
        this.userService.logout();
        this.userService.refreshUserData();
        this.router.navigate(['/events']);

      },
      error => {
        console.error('Error deactivating account', error);
      }
    );
  }
  
  cancelEdit(): void {
    this.isEditMode = false;
    this.loadUserData(); // Odśwież dane bez zapisywania zmian
  }
}
