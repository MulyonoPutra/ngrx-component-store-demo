import { switchMap, tap } from "rxjs";

import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { User } from "../models/user";
import { MockUserService } from "../services/mock-user.service";

export interface UsersState {
  users: User[];
  loading: boolean;
}

@Injectable()
export class UsersStore extends ComponentStore<UsersState> {

  constructor(private userService: MockUserService) {
    super({ users: [], loading: false });
  }

  readonly users$ = this.select(state => state.users);
  readonly loading$ = this.select(state => state.loading);

  // Updaters
  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly setUsers = this.updater((state, users: User[]) => ({
    ...state,
    users,
  }));

  // Effects
  readonly loadUsers = this.effect(trigger$ => trigger$.pipe(
    tap(() => this.setLoading(true)),
    switchMap(() => this.userService.getUsers().pipe(
      tap({
        next: (users) => {
          this.setUsers(users);
          this.setLoading(false);
        },
        error: () => this.setLoading(false),
      })
    ))
  ));

  readonly addUser = this.effect<User>(user$ => user$.pipe(
    switchMap(user => this.userService.createUser(user).pipe(
      tap(newUser => {
        this.setState(state => ({
          ...state,
          users: state.users.some(u => u.id === newUser.id)  // Check for existing user
            ? state.users  // If exists, return the same array
            : [...state.users, newUser]  // Otherwise, append new user
        }));
      })
    ))
  ));

  readonly updateUser = this.effect<User>(user$ => user$.pipe(
    switchMap(user => this.userService.updateUser(user).pipe(
      tap(updatedUser => {
        this.patchState(state => ({
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        }));
      })
    ))
  ));

  readonly deleteUser = this.effect<number>(id$ => id$.pipe(
    switchMap(id => this.userService.deleteUser(id).pipe(
      tap(() => {
        this.patchState(state => ({
          users: state.users.filter(u => u.id !== id)
        }));
      })
    ))
  ));
}
