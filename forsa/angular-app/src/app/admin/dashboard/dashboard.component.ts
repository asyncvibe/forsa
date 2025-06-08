import { GeneralService } from './../../services/general.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
// declare var $: any;
// import '../../../assets/js/theme';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private notification: NotificationService,
    private general: GeneralService,
    private router: Router,
    private user: UserService) {  }
  public alerts: any;
  public newAlerts: any;
  public admin: any;
  public backendURL = environment.Url.concat('/uploads');

  ngOnInit() {
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
    });
    // $.myTheme.navbar.activate();
    this.notification.fetchNotifications().subscribe(data => {

      this.alerts = data
      this.alerts = this.alerts.list
      // console.log('lets see:', this.alerts)

      this.general.currentNotifications.subscribe(data => {
        if (data.length > 0) {
          this.alerts = data
        }
      });

      this.general.getNotifications(this.alerts);
    });
    const id = localStorage.getItem('id');
    this.user.findOnUser(id).subscribe(user => {
      this.admin = user;
      this.admin = this.admin.list;
      console.log('admin:', this.admin);
    });
  }
  logoutAdmin() {
    if (window.confirm('Are you sure to logout?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    } else {
      return
    }
  }

}
