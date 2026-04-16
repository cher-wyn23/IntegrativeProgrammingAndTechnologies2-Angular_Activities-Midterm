import { Component, EventEmitter, Input, Output } from '@angular/core';

export type RegisteredUserRowUser = {
  name: string;
  username: string;
};

@Component({
  selector: 'tr[appRegisteredUserRow]',
  standalone: true,
  templateUrl: './registered-user-row.component.html',
})
export class RegisteredUserRowComponent {
  @Input({ required: true }) user!: RegisteredUserRowUser;
  @Input({ required: true }) index!: number;
  @Input() isEditing = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
}

