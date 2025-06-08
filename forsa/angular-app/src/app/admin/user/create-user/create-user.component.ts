import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';


function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const password = c.get('password')
  const confirmPassword = c.get('confirmPassword')
  if (password.pristine || confirmPassword.pristine) {
    return null;
  }
  if (password.value === confirmPassword.value) {
    return null;
  }
  return { 'match': true }
}


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  constructor(private fb: FormBuilder, private user: UserService, public toastr: ToastrManager, public router: Router) { }
  public selectedFile;
  public selectedFile2
  public uploadData = new FormData();

  profileForm = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(4)]],
    passwordGroup: this.fb.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
    }, { validator: passwordMatcher }),
    mobile: [null, [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
    email: [null, [Validators.required, Validators.email]],
    role: [null, [Validators.required]],
    image: [null, [Validators.required]],
    imageCompany: [null, [Validators.required]],
    description: [null, [Validators.required]],
    address: [null, [Validators.required]]

  });
  get f() { return this.profileForm.controls; }
  get p() { return this.profileForm.controls.passwordGroup }
  ngOnInit() {
  };

  uploadImage(event) {
    this.selectedFile = event.target.files[0]
    this.uploadData.append('image', this.selectedFile, this.selectedFile.name);
  }
  uploadImageCompany(event) {
    this.selectedFile2 = event.target.files[0]
    this.uploadData.append('imageCompany', this.selectedFile2, this.selectedFile2.name);
  }
  onSubmit() {
    console.log('values:', this.profileForm.value)
    console.log('my passwords', this.profileForm.value.passwordGroup.password)
    this.uploadData.append('password', this.profileForm.value.passwordGroup.password)
    for (let x in this.profileForm.value) {
      if (x != 'image' && x != 'passwordGroup' && x != 'imageCompany') {

        this.uploadData.append(x, this.profileForm.value[x])
      }
    }
    this.user.createUser(this.uploadData).subscribe(data => {
      if(data.isSuccess == true){
        this.toastr.successToastr(data.message, 'Success!');
        this.router.navigate(['/admin/users'])
      }
      if(data.isSuccess == false){
        this.toastr.warningToastr(data.message, 'Failure!');
      }
     
      console.log('this is coming data:', data)
    }, data => {
      this.toastr.warningToastr(data.message, 'Oops!');
    });
  }

}
