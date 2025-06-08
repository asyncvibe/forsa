import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";
@Component({
  selector: 'app-pending-featured-posts',
  templateUrl: './pending-featured-posts.component.html',
  styleUrls: ['./pending-featured-posts.component.css']
})
export class PendingFeaturedPostsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  constructor(private post: PostService, public toastr: ToastrManager, private fb: FormBuilder) { }
  profileForm = this.fb.group({
    startDate: ["", Validators.required],
    endDate: ["", Validators.required]
  });
  pendingfeaturedPosts: any;
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    localStorage.removeItem('url')
    this.post.findPendingFeaturedRequests().subscribe(res => {
      this.pendingfeaturedPosts = res;
      this.pendingfeaturedPosts = this.pendingfeaturedPosts.list;
      console.log('pending requests:', this.pendingfeaturedPosts)
      this.dtTrigger.next();
    }, error => {
      this.pendingfeaturedPosts = error;
      this.pendingfeaturedPosts = this.pendingfeaturedPosts.list;
      this.dtTrigger.next();
    });
  }

  deleteProperty(id) {
    if (window.confirm('Are you sure! you want to delete it from feature list?')) {
      this.post.changePostStatus(id).subscribe(res => {
        this.toastr.successToastr('This post is deleted!', 'Success');
        this.post.findPendingFeaturedRequests().subscribe(res => {
          this.pendingfeaturedPosts = res;
          this.pendingfeaturedPosts = this.pendingfeaturedPosts.list;
        });
      });
    }

  }

  approveFeaturedRequest(id) {
    if (window.confirm('Are you sure! you want to feature this post?')) {
      this.post.approveFeaturedRequest(id).subscribe(res => {
        this.toastr.successToastr('This is made featured successfully', 'Success');
        this.pendingfeaturedPosts = res;
        this.pendingfeaturedPosts = this.pendingfeaturedPosts.list;
      })
    }

  }
  onSubmit() {
  
    let startDate = moment(this.profileForm.value.startDate);
    let endDate = moment(this.profileForm.value.endDate);
    if (startDate === endDate) {
      return console.log("start date and end date are same.");
    }
    let dateFilter = this.pendingfeaturedPosts.filter(post => {
      let postDate = moment(post.createdAt);
      if (moment(startDate).isSame(endDate)) {
        return postDate >= startDate;
      }
        return postDate >= startDate && postDate <= endDate;
    });
    this.pendingfeaturedPosts = dateFilter;
    console.log("filter Result:", dateFilter);
  }

}
