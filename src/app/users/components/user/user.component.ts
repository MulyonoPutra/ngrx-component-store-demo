import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UsersStore } from '../../store/user.store';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UsersStore],
})
export class UserComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private usersStore: UsersStore,
    private readonly formBuilder: FormBuilder,) { }


  ngOnInit(): void {
    this.initForms();
    this.usersStore.loadUsers();
  }

  initForms(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  get formCtrlValue(): User {
    return {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
    };
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('submitted...', this.formCtrlValue);
    }
  }

  get users$(): Observable<User[]> {
    return this.usersStore.users$;
  }

  get loading$(): Observable<boolean> {
    return this.usersStore.loading$;
  }

  onAddUser() {
    if (this.formCtrlValue) {
      this.usersStore.addUser(this.formCtrlValue);
    }
  }

  onUpdateUser(user: User) {
    this.usersStore.updateUser(user);
  }

  onDeleteUser(id: number) {
    this.usersStore.deleteUser(id);
  }
}
