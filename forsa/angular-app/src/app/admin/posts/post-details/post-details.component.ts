import { Component, OnInit } from '@angular/core';
import { PostService} from '../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Toastr, ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  post: any;
  covers: any;
  backendUrl = environment.Url.concat('/uploads');
  constructor(private posts: PostService, private route: ActivatedRoute, private router: Router, private toastr: ToastrManager) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.posts.findOneProperty(id).subscribe(data => {
      this.post = data
      this.post = this.post.list
      this.covers = this.post.covers;
      console.log('these are cover images:', this.post.covers)
      console.log('this is the post whose details are needed:', this.post)
    });
  }

  onDelete(id){
    console.log('id to be deleted:',id);
    if (window.confirm('Are you sure! you want to delete this post?')) {
      this.posts.deletePost(id).subscribe(res => {
        this.toastr.successToastr('This post is deleted!', 'Success');
        this.router.navigate(['/admin/postlisting'])
      },error=> this.toastr.successToastr(error, 'Success'));
    } else {
      return;
    }
  }
  

}
