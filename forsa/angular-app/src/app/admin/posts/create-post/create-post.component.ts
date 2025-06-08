import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { validateConfig } from '@angular/router/src/config';
import { PostService } from 'src/app/services/post.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  constructor(private fb: FormBuilder, private user: UserService,
    private post: PostService, public toastr: ToastrManager) { }

  public selectedFile = [];
  public uploadData = new FormData();
  public categories;
  public categoryType = null;

  createPostForm = this.fb.group({
    address: [null, [Validators.required, Validators.minLength(6)]],
    // createdBy: [null, [Validators.required]],
    role: [null, Validators.required],
    isFeatured: [''],
    isFurnished: [''],
    area: [null, [Validators.required]],
    propertyType: [null, [Validators.required]],
    purpose: [null, [Validators.required]],
    bedRooms: null,
    bathRooms: null,
    subCategoryType: null,
    status: [null],
    price: [null, [Validators.required]],
    covers: [null, [Validators.required]],
    summary: [null, [Validators.required]]

  });
  get f() { return this.createPostForm.controls; }
  ngOnInit() {
    this.post.findAllCategories().subscribe(data => {
      this.categories = data
      this.categories = this.categories.list

    })
  }
  // selectedCategory(event) {
  //   this.uploadData.append('categoryId', event.target.value);
  //   // console.log('this is selected category:', event.target.value)
  // }
  uploadImage(event) {
    this.selectedFile = [];
    console.log('event length:', event.target.files.length)
    for (let i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i])
    }
    console.log('array after push:', this.selectedFile)
  }
  onSubmit() {
    console.log('form values:', this.createPostForm.value)
    for (let i = 0; i < this.selectedFile.length; i++) {
      this.uploadData.append('covers', this.selectedFile[i], this.selectedFile[i].name)
    }
    for (let x in this.createPostForm.value) {
      if (x != 'covers') {
        this.uploadData.append(x, this.createPostForm.value[x])
      }
    }
    this.post.createPostByAdmin(this.uploadData).subscribe(data => {
      let mydata = data
      console.log('my data', mydata)
      if (mydata.isSuccess == true) {
        this.toastr.successToastr(mydata.message, 'Success!');
        this.createPostForm.reset();
        this.uploadData = new FormData();
        // this.createPostForm.reset();
      }
    }, data => {
      let mydata = data
      this.toastr.errorToastr(mydata.message, 'Oops!');
    });

  }
  PropertyTypeSelect(e){
    this.categoryType = e.target.value
    console.log('this is coming value from dropdown.', e.target.value)
  }
}
