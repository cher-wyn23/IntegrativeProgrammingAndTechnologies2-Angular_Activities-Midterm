import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  @Input({ required: true }) currentUserName!: string;
  @Input() currentUserRole = 'Active User';
  @Input({ required: true }) username!: string;
  @Output() logout = new EventEmitter<void>();
}
