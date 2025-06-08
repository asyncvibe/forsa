import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component'
import { DashboardRoutingModule } from './dashboard-routing.module';
import { UsersComponent } from '../user/users.component';
import { DataTablesModule } from 'angular-datatables';
import { PostsComponent } from '../posts/posts.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { ListsComponent } from '../lists/lists.component';
import { BellNotificationsComponent } from '../bell-notifications/bell-notifications.component';
import { VerifiedUsersComponent } from '../user/verified-users/verified-users.component';
import { CustomersComponent } from '../customers/customers.component';
import { BrokerComponent } from '../broker/broker.component';
import { LandlordComponent } from '../landlord/landlord.component';
import { CreateUserComponent } from '../user/create-user/create-user.component';
import { UpdateUserComponent } from '../user/update-user/update-user.component';
import { UserDetailsComponent } from '../user/user-details/user-details.component';
import { BrokerDetailsComponent } from '../broker/broker-details/broker-details.component';
import { CreatePostComponent } from '../posts/create-post/create-post.component';
import { UpdatePostComponent } from '../posts/update-post/update-post.component'
// import { MatTableModule } from '@angular/material/table';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { PostListingComponent } from '../posts/post-listing/post-listing.component';
import { PostDetailsComponent } from '../posts/post-details/post-details.component';
import { FeaturedPostsComponent } from '../posts/featured-posts/featured-posts.component';
import { PendingFeaturedPostsComponent } from '../posts/pending-featured-posts/pending-featured-posts.component';
import { InactiveComponent } from '../posts/inactive/inactive.component';
import { ComposeEmailComponent } from '../compose-email/compose-email.component';
import { ActivePostsComponent } from '../posts/active-posts/active-posts.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
@NgModule({
  declarations: [
    ActivePostsComponent,
    DashboardComponent,
    UsersComponent,
    PostsComponent,
    NotificationsComponent,
    ListsComponent,
    BellNotificationsComponent,
    VerifiedUsersComponent,
    CustomersComponent,
    BrokerComponent,
    LandlordComponent,
    CreateUserComponent,
    UpdateUserComponent,
    UserDetailsComponent,
    BrokerDetailsComponent,
    CreatePostComponent,
    UpdatePostComponent,
    PostListingComponent,
    PostDetailsComponent,
    FeaturedPostsComponent,
    PendingFeaturedPostsComponent,
    InactiveComponent,
    ComposeEmailComponent,
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DataTablesModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTableModule,
    // MatFormFieldModule


  ]
})
export class DashboardModule { }
