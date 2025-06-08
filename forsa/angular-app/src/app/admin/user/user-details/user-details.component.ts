import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { PostService } from "src/app/services/post.service";
import { ToastrManager } from "ng6-toastr-notifications";
@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"]
})
export class UserDetailsComponent implements OnInit {
  backendUrl = environment.Url.concat("/uploads");
  constructor(
    private user: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private post: PostService,
    private toastr: ToastrManager
  ) {}

  public brokerPosts: any;
  public person: any;
  public userRole: any;
  public covers: any;
  public userPosts: any;
  public userPostCovers: any;
  public bakenUrl = environment.Url.concat("/uploads");
  ngOnInit() {
    localStorage.setItem('url', this.router.url)
    let id = this.route.snapshot.paramMap.get("id");
    this.userRole = this.route.snapshot.paramMap.get("role");
    console.log("the role of the user is:", this.userRole);
    this.user.findOnUser(id).subscribe(
      data => {
        this.person = data;
        this.person = this.person.list;
        console.log("person detials:", this.person);
        for (let i = 0; i < this.person.length; i++) {
          this.brokerPosts = this.person[i].assignedPosts;
          console.log("brokers:::", this.brokerPosts);
          // for (let i = 0; i < this.brokerPosts.length; i++) {

          //   console.log('lets see what is in the cover:',this.brokerPosts[i].covers[0])

          // }
          // for (let cover of this.brokerPosts) {
          //   this.covers = cover.covers;
          //   console.log('these are elements in the brokers post.', cover.covers)
          // }
          // this.covers = this.person[i].covers
          // this.brokerPosts = this.brokerPosts.assignedPosts
        }
        console.log("these are assigned post to broker:", this.brokerPosts);
      },
      error => {
        this.brokerPosts = [];
      }
    );

    this.post.UserCreatedPosts(id).subscribe(
      data => {
        this.userPosts = data;
        this.userPosts = this.userPosts.list;
        for (let cover of this.userPosts) {
          this.userPostCovers = cover.covers;
          console.log("these are the posts:", cover.covers);
        }
        // console.log('these are user created posts:', this.userPosts)
      },
      error => {
        this.userPosts = error;
        this.userPosts = this.userPosts.list;
      }
    );
  }

  onDelete(id) {
    console.log("id to be deleted:", id);
    if (window.confirm("Are you sure! you want to delete this post?")) {
      this.post.deletePost(id).subscribe(
        res => {
          this.toastr.successToastr("This post is deleted!", "Success");
          this.router.navigate(["/admin/postlisting"]);
        },
        error => this.toastr.successToastr(error, "Success")
      );
    } else {
      return;
    }
  }
  updatePost(id){
  
    this.router.navigate(['/admin/updatepost',id])
    
  }
}
