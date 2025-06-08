import { Component, OnInit } from '@angular/core';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from 'src/app/services/post.service';
import { environment } from '../../../environments/environment'
import { UserService } from 'src/app/services/user.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  property: any;
  lists
  assignButton = false
  selectedIdsArray = []
  selectedItems = [];
  dropdownSettings = {};
  backendUrl = environment.Url.concat('/uploads');
  constructor(private posts: PostService, private users: UserService,public toastr: ToastrManager) {

  }

  ngOnInit() {
    this.posts.findAllPosts().subscribe(data => {
      this.property = data
      this.property = this.property.list
      console.log('the coming posts:', this.property)
    });


  }

  onChange(id) {
    this.selectedIdsArray.push(id)

  }

  assignTo() {
    this.assignButton = true
    this.users.findBrokers().subscribe(data => {
      this.lists = data
      this.lists = this.lists.list
      console.log('These are the lists:', this.lists)

    })
  }

  assignPostsToUser(id) {
    console.log('this is assigned:', id)
    console.log('these are post ids:', this.selectedIdsArray)
    this.users.assignPostsToUser(id, this.selectedIdsArray).subscribe(
      data => {console.log("this is the response",data)}
    )
  }


  onSubmit(id) {
    // this.posts.assignPropertyToList(this.selectedIdsArray, id).subscribe(data => {
      // console.log('this response is coming:', data)
    // })
  }


}
