import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, public toastr: ToastrManager) { }
  public users: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.userService.findAllUsers().subscribe(data => {
      this.users = data
      this.users = this.users.list
      console.log('userss', this.users)

      this.dtTrigger.next();
    })
  }
  deleteUser(id) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.userService.deleteUser(id).subscribe(data => {
        this.toastr.successToastr('This user is deleted!', 'Success');
        console.log('this user has been deleted:', data)
        this.userService.findAllUsers().subscribe(data => {
          this.users = data
          this.users = this.users.list
          console.log('this is the updated list of users')

          // this.dtTrigger.next();
        })
      });
    } else {
      return
    }


  };

  userDetails(id, role) {
    this.router.navigate(['/admin/userdetails', id, role])
  };

  editUser(id) {
    this.router.navigate(['/admin/updateuser', id]);
  };

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  };


}
