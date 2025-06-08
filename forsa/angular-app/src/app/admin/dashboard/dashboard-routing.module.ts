import { ActivePostsComponent } from './../posts/active-posts/active-posts.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from '../user/users.component';
import { PostsComponent } from '../posts/posts.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ListsComponent } from '../lists/lists.component';
import { BellNotificationsComponent } from '../bell-notifications/bell-notifications.component';
import { VerifiedUsersComponent } from '../user/verified-users/verified-users.component';
import { BrokerComponent } from '../broker/broker.component';
import { CustomersComponent } from '../customers/customers.component';
import { LandlordComponent } from '../landlord/landlord.component';
import { UpdateUserComponent } from '../user/update-user/update-user.component';
import { UserDetailsComponent } from '../user/user-details/user-details.component';
import { UpdatePostComponent } from '../posts/update-post/update-post.component';
import { PostListingComponent } from '../posts/post-listing/post-listing.component';
import { PostDetailsComponent } from '../posts/post-details/post-details.component';
import { CreateUserComponent } from '../user/create-user/create-user.component';
import { CreatePostComponent } from '../posts/create-post/create-post.component';
import { FeaturedPostsComponent } from '../posts/featured-posts/featured-posts.component';
import { PendingFeaturedPostsComponent } from '../posts/pending-featured-posts/pending-featured-posts.component';
import { InactiveComponent } from '../posts/inactive/inactive.component';
import { ComposeEmailComponent } from '../compose-email/compose-email.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { ResolverService } from 'src/app/services/resolver.service';
import { PostResolverService } from 'src/app/services/post.resolver';
const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', component: UsersComponent },
      { path: 'users', component: UsersComponent },
      {
        path: 'analytics', component: AnalyticsComponent
        , resolve: {
          cres: ResolverService,
          posts: PostResolverService
        },

      },
      { path: 'createUser', component: CreateUserComponent },
      { path: 'posts', component: PostsComponent },
      { path: 'createPost', component: CreatePostComponent },
      { path: 'unverified', component: NotificationsComponent },
      { path: 'verified', component: VerifiedUsersComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'notifications', component: BellNotificationsComponent },
      { path: 'broker', component: BrokerComponent },
      { path: 'customer', component: CustomersComponent },
      { path: 'landlord', component: LandlordComponent },
      { path: 'updateuser/:id', component: UpdateUserComponent },
      { path: 'updatepost/:id', component: UpdatePostComponent },
      { path: 'userdetails/:id/:role', component: UserDetailsComponent },
      { path: 'postlisting', component: PostListingComponent },
      { path: 'postdetails/:id', component: PostDetailsComponent },
      { path: 'featuredPosts', component: FeaturedPostsComponent },
      { path: 'pendingFeaturedPosts', component: PendingFeaturedPostsComponent },
      { path: 'inactivePosts', component: InactiveComponent },
      { path: 'composeEmail', component: ComposeEmailComponent },
      { path: 'activePosts', component: ActivePostsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
