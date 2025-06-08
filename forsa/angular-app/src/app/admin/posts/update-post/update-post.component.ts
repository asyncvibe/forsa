import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {
  public dbValues: any;
  public covers: any;
  selectedFiles = [];
  public categories;
  public propertyType = null;
  public uploadData = new FormData();
  constructor(private fb: FormBuilder, private user: UserService,
    private post: PostService, public toastr: ToastrManager, private router: Router,
    private route: ActivatedRoute) { }
  public backendUrl = environment.Url.concat('/uploads')
  updatePostForm = this.fb.group({
    address: ['', [Validators.required, Validators.minLength(6)]],
    // createdBy: ['', [Validators.required]],
    role: ['', Validators.required],
    isFeatured: [false],
    isFurnished: [''],
    area: ['', [Validators.required]],
    propertyType: ['', [Validators.required]],
    purpose: ['', [Validators.required]],
    bedRooms: [null, [Validators.required]],
    bathRooms: null,
    subCategoryType: null,
    status: [null],
    price: ['', [Validators.required]],
    // covers: ['', Validators.required],
    summary: ['', [Validators.required]]
  });
  get f() { return this.updatePostForm.controls; }
  ngOnInit() {
    // this.post.findAllCategories().subscribe(data => {
    //   this.categories = data
    //   this.categories = this.categories.list

    // });
    let id = this.route.snapshot.paramMap.get('id');
    this.post.findOneProperty(id).subscribe(list => {
      this.dbValues = list;
      this.dbValues = this.dbValues.list;
      this.covers = this.dbValues.covers;
     if(this.dbValues.isFeatured == 'true'){
       this.dbValues.isFeatured = true
     }else{
       this.dbValues.isFeatured = false
     }
     if(this.dbValues.isFurnished == 'true'){
       this.dbValues.isFurnished = true
     }else{
       this.dbValues.isFurnished = false
     }
     if(this.dbValues.propertyType == 'Residential'){
      this.propertyType = 'Residential'
     }
     if(this.dbValues.propertyType == 'Commercial'){
      this.propertyType = 'Commercial'
     }
    
      console.log('convers', this.covers);
      console.log('dbvalues', this.dbValues);
      this.updatePostForm.patchValue(this.dbValues)
    });
  }
  deleteImage(imageName) {
    console.log('cover image:', imageName)
    let id = this.route.snapshot.paramMap.get('id');
    this.post.deleteImage(id, imageName).subscribe(data => {
      this.covers = data.findUPdatedPost.covers
      console.log('covers:', this.covers);
    });
  }
  uploadImage(event) {
    let uploadData = new FormData();
    this.selectedFiles = [];
    console.log('length of array:', event.target.files.length);
    for (let value of event.target.files) {
      this.selectedFiles.push(value)
      // console.log('in the for of loop of javascript:', value)
    }
    for (let data of this.selectedFiles) {
      uploadData.append('covers', data, data.name);
    }
    let id = this.route.snapshot.paramMap.get('id');
    this.post.uploadImage(id, uploadData).subscribe(res => {
      this.covers = res.findUPdatedPost.covers;
      console.log('covers:', this.covers);
    });
  }
  selectedCategory(event) {
    this.propertyType = event.target.value
    console.log('change event called', event.target.value)
    this.uploadData.append('categoryId', event.target.value)
    // console.log('this is selected category:', event.target.value)
  }
  onSubmit() {
    console.log('form values:', this.updatePostForm.value)
    let id = this.route.snapshot.paramMap.get('id');
    this.post.updatePost(id, this.updatePostForm.value).subscribe(res => {
      this.toastr.successToastr('This post has been updated successfully!', 'Success');
      console.log('the updated response:', res);
      if(localStorage.getItem('url')){
        let url = localStorage.getItem('url')
        return this.router.navigate([url])
      }
      this.router.navigate(['/admin/postlisting']);
    });
  }
}
