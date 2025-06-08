import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.css']
})
export class ComposeEmailComponent implements OnInit {

  constructor(private fb: FormBuilder, private user: UserService, public toastr: ToastrManager) { }
  profileForm = this.fb.group({
    to: [null, [Validators.required, Validators.email]],
    subject: [null, [Validators.required,Validators.minLength(6)]],
    html: [null, [Validators.required,Validators.minLength(10)]]

  });
  get f() { return this.profileForm.controls; }
  ngOnInit() {
  }
  onSubmit() {
    console.log('this email will go:', this.profileForm.value)
    this.user.sendEmailToUser(this.profileForm.value).subscribe(res => {
      this.toastr.successToastr('Email has been sent Successfully', 'Success!');
      console.log('this is email response:', res)
      this.profileForm.reset();
    }, error => {
      console.log('the email is not sent', error)
    });
  }

}
