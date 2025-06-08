import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  constructor(private fb: FormBuilder, private user: UserService, private route: ActivatedRoute,
    private router: Router, ) { }
  public selectedFile;
  public dbValue: any
  public uploadData = new FormData();
  public backendUrl = environment.Url.concat('/uploads')
  public image:any;
  public companyImage: any;

  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]],
    image: ['', [Validators.required]],
    description: ['', [Validators.required]],
    address: ['', [Validators.required]]
    

  });

  get f() { return this.profileForm.controls };
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')
    this.user.findOnUser(id).subscribe(data => {
      this.dbValue = data
      this.dbValue = this.dbValue.list
      this.image = this.dbValue[0].image;
      this.companyImage = this.dbValue[0].imageCompany
      console.log('the one user valus, who will be edited', this.dbValue[0].imageCompany)
      this.profileForm.patchValue(this.dbValue[0])

    })
  }
  updateImage(event){

     const selectedFile = event.target.files[0]
    const uploadData = new FormData();
    uploadData.append('image', selectedFile, selectedFile.name);
    let id = this.route.snapshot.paramMap.get('id')
    this.user.updateImage(id, uploadData).subscribe(res=>{
      this.image = res.image
      console.log('this is the comming response.', res)
    })
    
  }
  updateCompanyImage(event){
    const selectedFile = event.target.files[0]
    const uploadData = new FormData();
    let id = this.route.snapshot.paramMap.get('id')
    uploadData.append('imageCompany', selectedFile, selectedFile.name);
    this.user.updateCompanyImage(id, uploadData).subscribe(res=>{
      this.companyImage = res.image
      console.log('this is the comming response.', res)
    })

    
  }



  onSubmit() {
    let id = this.route.snapshot.paramMap.get('id')

    this.user.updateUser(id, this.profileForm.value).subscribe(data => {
      console.log('this is updated data:', data)
      this.router.navigate(['/admin/users']);
    })
  }

}
