import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
@Component({
  selector: 'app-verified-users',
  templateUrl: './verified-users.component.html',
  styleUrls: ['./verified-users.component.css']
})
export class VerifiedUsersComponent implements OnInit {

  constructor(private userService: UserService, public toastr: ToastrManager, private router: Router) { }
  public users: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.userService.findVerifiedUsers().subscribe(data => {
      this.users = data
      this.users = this.users.list
      console.log('verified users:', this.users)


      this.dtTrigger.next();
    })
  }
  userDetails(id, role) {
    this.router.navigate(['/admin/userdetails', id, role])
  };
  editUser(id) {
    this.router.navigate(['/admin/updateuser', id]);
  };
  deleteUser(id) {
    if (window.confirm('Are you sure you want to delte')) {
      this.userService.deleteUser(id).subscribe(data => {
        console.log('this verified user is updated', data)
        this.toastr.successToastr('This user is deleted', 'Success!');
        this.userService.findVerifiedUsers().subscribe(data => {
          this.users = data
          this.users = this.users.list
          console.log('this is updated list of verified users:', this.users)
        })
      })
    } else {
      return;
    }

  }

}
