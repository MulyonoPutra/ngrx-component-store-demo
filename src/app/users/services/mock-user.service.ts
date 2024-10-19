import { Observable, delay, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { mockUsers } from '../utils/mock-users';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  private users = [...mockUsers]; // Initialize with mock data

  getUsers(): Observable<User[]> {
    // Simulate HTTP delay with 'of' and 'delay'
    return of(this.users).pipe(delay(500));  // Simulates network latency
  }

  createUser(user: User): Observable<User> {
    user.id = this.users.length + 1;  // Simulate auto-increment ID
    this.users.push(user);
    return of(user).pipe(delay(500));
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.users[index] = user;
    }
    return of(user).pipe(delay(500));
  }

  deleteUser(id: number): Observable<void> {
    this.users = this.users.filter(u => u.id !== id);
    return of(undefined).pipe(delay(500));
  }
}
