import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-bell-notifications',
  templateUrl: './bell-notifications.component.html',
  styleUrls: ['./bell-notifications.component.css']
})
export class BellNotificationsComponent implements OnInit {

  constructor(private notification: NotificationService) { }
  notifications: any
  featuredPending:any
  ngOnInit() {
    this.notification.fetchNotifications().subscribe(data => {
      this.notifications = data
      this.notifications = this.notifications.list
      console.log('these are the notifications:', this.notifications)
    });
    this.notification.fetchFeaturedPropertyNotifications().subscribe(data =>{
      this.featuredPending = data;
      console.log('featured post:', this.featuredPending)
      this.featuredPending = this.featuredPending.list;
      console.log('featured post:', this.featuredPending)
    });
  }

}
