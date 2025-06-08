import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public token;
  public role;
  public id;
  constructor(private fb: FormBuilder, private user: UserService, private router: Router, public toastr: ToastrManager) { }
  profileForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]

  });
  ngOnInit() {
  }
  onSubmit() {
    this.user.LoginUser(this.profileForm.value).subscribe(data => {
      const response = data;
    
      if (response.token && response.details.role === 'admin') {
        this.token = localStorage.setItem('token', response.token);
        this.token = localStorage.setItem('role', response.details.role);
        this.id = localStorage.setItem('id', response.details._id);
        this.router.navigate(['/admin']);
       
      } else {
        this.toastr.errorToastr('You are not an Admin', 'Oops!');
      }
    }, data => {
      this.toastr.errorToastr(data.message, 'Oops!');
    });
  }
}
