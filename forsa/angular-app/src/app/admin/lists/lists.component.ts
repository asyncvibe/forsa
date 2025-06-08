import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  constructor(private lists: PostService, private user: UserService) { }
  list: any
  dropdownList: any;
  public selectedPeople = []
  selectedItems = [];
  dropdownSettings = {};


  ngOnInit() {
    this.lists.fetchAllLists().subscribe(data => {
      this.list = data.list
      console.log('this is simple list:.', this.list)

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
        idField: '_id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };

    });
    this.user.findBrokers().subscribe(broker => {
      this.dropdownList = broker
      this.dropdownList = this.dropdownList.list
      console.log('broker:', this.dropdownList)
    });
  }

  loadBrokers() {

  }


  onItemSelect(item) {
    this.selectedPeople.push(item._id)
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSubmit(id) {
    console.log('these are the names of lists:', id)
    console.log('this selected people:', this.selectedPeople)
    this.lists.assignPeopleToList(id, this.selectedPeople).subscribe(data => {
      console.log('assign People to list:', data)
    })
  }

}
