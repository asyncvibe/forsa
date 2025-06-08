import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { PostService } from "../../../services/post.service";
import { environment } from "src/environments/environment";
import { UserService } from "src/app/services/user.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";
import { element } from "@angular/core/src/render3";
import { copyStyles } from "@angular/animations/browser/src/util";
@Component({
  selector: "app-post-listing",
  templateUrl: "./post-listing.component.html",
  styleUrls: ["./post-listing.component.css"]
})
export class PostListingComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dropdownList;
  selectedItems = [];
  dropdownSettings = {};
  dtTrigger = new Subject();
  public property: any;
  selectedIdsArray = [];
  lists;
  checkBox = false;
  assignButton = false;
  public backendUrl = environment.Url.concat("/uploads");
  constructor(
    private posts: PostService,
    private users: UserService,
    public toastr: ToastrManager,
    private fb: FormBuilder
  ) {}
  profileForm = this.fb.group({
    startDate: ["", Validators.required],
    endDate: ["", Validators.required]
  });

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10
    };
    localStorage.removeItem("url");
    this.posts.findAllPosts().subscribe(
      data => {
        this.property = data;
        this.property = this.property.list;
        console.log("all properties:", this.property);
        this.dtTrigger.next();
      },
      error => {
        this.property = error;
        this.property = this.property.list;
        this.dtTrigger.next();
      }
    );
    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' }
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "_id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log("this is the user id, to whom list to be assigned:", item._id);

    console.log("these are post ids:", this.selectedIdsArray);
    this.users
      .assignPostsToUser(item._id, this.selectedIdsArray)
      .subscribe(data => {
        console.log("this is the response", data);
      });
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
  onChange(id) {
    let elementIndex = this.selectedIdsArray.indexOf(id)
    if(elementIndex == -1) return this.selectedIdsArray.push(id);
    
    return this.selectedIdsArray.splice(elementIndex,1)
  }
  assignTo() {
    this.assignButton = true;
    this.users.findBrokers().subscribe(data => {
      this.dropdownList = data;
      this.dropdownList = this.dropdownList.list;
      console.log("this is the list of brokers:", this.dropdownList);
    });
  }

  // assignPostsToBroker(id) {
  //   console.log('this is assigned:', id)
  //   console.log('these are post ids:', this.selectedIdsArray)
  //   this.users.assignPostsToUser(id, this.selectedIdsArray).subscribe(
  //     data => { console.log("this is the response", data) }
  //   );
  // }
  deleteProperty(id) {
    if (window.confirm("Are you sure! you want to delete this post?")) {
      this.posts.deletePost(id).subscribe(res => {
        this.toastr.successToastr("This post is deleted!", "Success");
        this.property = res;
        this.property = this.property.list;
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
    let dateFilter = this.property.filter(post => {
      let postDate = moment(post.createdAt);
      if (moment(startDate).isSame(endDate)) {
        // return postDate >= startDate;
        return moment(startDate).isSameOrBefore(postDate);
      }
      return postDate >= startDate && postDate <= endDate;
    });
    this.property = dateFilter;
    // this.profileForm.reset();
    console.log("filter Result:", dateFilter);
  }
}
