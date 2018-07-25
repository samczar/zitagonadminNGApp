import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import {AuthService} from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  providers:[AuthService]
})
export class DefaultLayoutComponent {
userEmail = JSON.parse(localStorage.getItem('userEmail'));
get= this.userEmail.email;
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(private auth:AuthService, private route:Router) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  
  }
  logoff(){
    this.auth.logout();
    this.route.navigate(['/login']);
  }
 
    
  
}
