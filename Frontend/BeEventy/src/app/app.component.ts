import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'BeEventy';
  hideNavBar() {
    const navBar = document.getElementById('navigation-bar');
    if (navBar) {
      navBar.style.display = 'none';
    }
  }
  
}
