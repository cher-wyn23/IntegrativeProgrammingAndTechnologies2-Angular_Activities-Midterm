import { Component, Input } from '@angular/core';

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
}

