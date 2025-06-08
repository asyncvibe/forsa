import { Component, OnInit } from "@angular/core";
import { PostService } from "src/app/services/post.service";
import { Subject } from "rxjs";
import { ToastrManager } from "ng6-toastr-notifications";
import { FormBuilder, Validators } from "@angular/forms";
import {environment} from '../../../../environments/environment'
import * as moment from "moment";
@Component({
  selector: "app-featured-posts",
  templateUrl: "./featured-posts.component.html",
  styleUrls: ["./featured-posts.component.css"]
})
export class FeaturedPostsComponent implements OnInit {
  constructor(private post: PostService, public toastr: ToastrManager,private fb: FormBuilder) {}
  public backendUrl = environment.Url.concat("/uploads");
  profileForm = this.fb.group({
    startDate: ["", Validators.required],
    endDate: ["", Validators.required]
  });
  featuredPosts: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
    localStorage.removeItem("url");
    this.post.findFeaturedProperties().subscribe(
      res => {
        this.featuredPosts = res;
        this.featuredPosts = this.featuredPosts.list;
        console.log("these are featured properties:", res.list);
        this.dtTrigger.next();
      },
      error => {
        this.featuredPosts = error;
        this.featuredPosts = this.featuredPosts.list;
        console.log("these are featured properties:", error);
        this.dtTrigger.next();
      }
    );
  }

  deleteProperty(id) {
    if (window.confirm("Are you sure, to delete this post?")) {
      this.post.deletePost(id).subscribe(res => {
        this.toastr.successToastr("This post is deleted!", "Success");
        this.post.findFeaturedProperties().subscribe(
          res => {
            this.featuredPosts = res;
            this.featuredPosts = this.featuredPosts.list;
          },
          error => {
            this.featuredPosts = error;
            this.featuredPosts = this.featuredPosts.list;
          }
        );
      });
    } else {
      return;
    }
  }

  shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  scramble() {
    this.post.findFeaturedProperties().subscribe(res => {
      this.featuredPosts = res.list;
      this.featuredPosts = this.shuffle(this.featuredPosts);
      console.log("scrambling:", res.list);
    });
  }

  onSubmit() {
  
    let startDate = moment(this.profileForm.value.startDate);
    let endDate = moment(this.profileForm.value.endDate);
    if (startDate === endDate) {
      return console.log("start date and end date are same.");
    }
    let dateFilter = this.featuredPosts.filter(post => {
      let postDate = moment(post.createdAt);
      if (moment(startDate).isSame(endDate)) {
        return postDate >= startDate;
      }
        return postDate >= startDate && postDate <= endDate;
    });
    this.featuredPosts = dateFilter;
    console.log("filter Result:", dateFilter);
  }
}
