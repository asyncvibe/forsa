import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";
@Component({
  selector: 'app-inactive',
  templateUrl: './inactive.component.html',
  styleUrls: ['./inactive.component.css']
})
export class InactiveComponent implements OnInit {
  InActivePosts: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  constructor(private post: PostService, public toastr: ToastrManager,  private fb: FormBuilder) { }
  profileForm = this.fb.group({
    startDate: ["", Validators.required],
    endDate: ["", Validators.required]
  });
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    localStorage.removeItem('url')
    this.post.findInActivePosts().subscribe(res => {
      this.InActivePosts = res;
      this.InActivePosts = this.InActivePosts.list;
      console.log('inactive posts', this.InActivePosts);
      this.dtTrigger.next();
    }, error=>{
      this.InActivePosts = error;
      this.InActivePosts = this.InActivePosts.list;
      this.dtTrigger.next();
    });
  }
  deleteProperty(id) {
    if (window.confirm('Are you sure! you want to delete this post?')) {
      this.post.deletePost(id).subscribe(res => {
        this.toastr.successToastr('This post is deleted!', 'Success');
        this.post.findInActivePosts().subscribe(res => {
          this.InActivePosts = res;
          this.InActivePosts = this.InActivePosts.list;
        }, error => {
          this.InActivePosts = error;
          this.InActivePosts = this.InActivePosts.list;
        });
      });
    } else {
      return;
    }

  }
  approvePost(id) {
    if (window.confirm('Are you sure!, you want to activate this post?')) {
      this.post.approvePost(id).subscribe(res => {
        this.InActivePosts = res;
        this.InActivePosts = this.InActivePosts.list;
      });
    } else {
      return;
    }

  }

  onSubmit() {
  
    let startDate = moment(this.profileForm.value.startDate);
    let endDate = moment(this.profileForm.value.endDate);
    if (startDate === endDate) {
      return console.log("start date and end date are same.");
    }
    let dateFilter = this.InActivePosts.filter(post => {
      let postDate = moment(post.createdAt);
      if (moment(startDate).isSame(endDate)) {
        return postDate >= startDate;
      }
        return postDate >= startDate && postDate <= endDate;
    });
    this.InActivePosts = dateFilter;
    console.log("filter Result:", dateFilter);
  }

}
