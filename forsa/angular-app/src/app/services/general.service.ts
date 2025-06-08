import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  unverifiedUsers: any;


  private newNotification = new BehaviorSubject<any>([]);
  currentNotifications = this.newNotification.asObservable();

  constructor() {
  }

  getNotifications(notifications: any) {
    this.newNotification.next(notifications)
  }
}
