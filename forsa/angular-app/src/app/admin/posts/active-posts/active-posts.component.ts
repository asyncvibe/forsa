import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";
@Component({
  selector: 'app-active-posts',
  templateUrl: './active-posts.component.html',
  styleUrls: ['./active-posts.component.css']
})
export class ActivePostsComponent implements OnInit {
  activePosts: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  constructor(private post: PostService, public toastr: ToastrManager,private fb: FormBuilder) { }
  profileForm = this.fb.group({
    startDate: ["", Validators.required],
    endDate: ["", Validators.required]
  });

  ngOnInit() {
    localStorage.removeItem('url')
    this.post.findActivePosts().subscribe(res => {
      this.activePosts = res;
      this.activePosts = this.activePosts.list;
      console.log('active posts', this.activePosts);
      this.dtTrigger.next();
    }, error => {
      this.activePosts = error;
      this.activePosts = this.activePosts.list;
      this.dtTrigger.next();
    });
  }
  deleteProperty(id) {
    if (window.confirm('Are you sure! you want to delete this post?')) {
      this.post.deletePost(id).subscribe(res => {
        this.toastr.successToastr('This post is deleted!', 'Success');
        this.post.findActivePosts().subscribe(res => {
          this.activePosts = res;
          this.activePosts = this.activePosts.list;
        }, error => {
          this.activePosts = error;
          this.activePosts = this.activePosts.list;
        });
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
    let dateFilter = this.activePosts.filter(post => {
      let postDate = moment(post.createdAt);
      if (moment(startDate).isSame(endDate)) {
        return postDate >= startDate;
      }
        return postDate >= startDate && postDate <= endDate;
    });
    this.activePosts = dateFilter;
    this.dtTrigger.next();
    console.log("filter Result:", dateFilter);
  }

}
