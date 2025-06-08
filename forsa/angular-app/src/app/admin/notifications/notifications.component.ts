import { GeneralService } from './../../services/general.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnDestroy, OnInit {
  public unVerified: any;
  notifications: [];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  constructor(private user: UserService, private general: GeneralService, public toastr: ToastrManager) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.user.findUnverifiedUsers().subscribe(data => {
      this.unVerified = data
      this.unVerified = this.unVerified.list
      // this.general.currentNotifications.subscribe(x => { this.notifications = x });
      this.dtTrigger.next();
    });

  }
  deleteUser(id) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      this.user.deleteUser(id).subscribe(data => {
        console.log('this verified user is updated', data)
        this.toastr.successToastr('This user is deleted', 'Success!');
        this.user.findUnverifiedUsers().subscribe(data => {
          this.unVerified = data
          this.unVerified = this.unVerified.list
        });
      });
    } else {

      return;
    }

  }
  verifyUser(id) {
    if (window.confirm('Are you sure, you want to verify this user?')) {
      this.user.verifyUser(id).subscribe(data => {
        this.unVerified = data
        this.unVerified = this.unVerified.list
        // this.general.getNotifications(this.unVerified);
        // console.log('users after verification:', this.unVerified)

      })
    } else {
      return;
    }
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
