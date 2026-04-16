import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  @Input({ required: true }) displayName!: string;
  @Input({ required: true }) username!: string;

  @Output() logoutRequested = new EventEmitter<void>();

  onLogoutClick() {
    this.logoutRequested.emit();
  }
}

