import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../services/base.service'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {
  backendUrl = environment.Url.concat('/api/notification')
  constructor(protected http: HttpClient) { super(http) }

  fetchNotifications() {
    return this.http.get(`${this.backendUrl}/fetchNotification`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));

  }
  fetchFeaturedPropertyNotifications() {
    return this.http.get(`${this.backendUrl}/fetchNotificationforFeturedPosts`)
      .pipe(tap(data => <any>data),
        catchError(this.handleError));

  }
}
