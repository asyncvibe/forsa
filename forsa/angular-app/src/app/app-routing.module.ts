import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./register/login/login.component";
import { AuthGuard } from "./auth/auth.guard";
import { DashboardComponent } from "./admin/dashboard/dashboard.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "forgetpassword", component: ForgetPasswordComponent },
  // {path: 'admin/dashboard', loadChildren: './orders/orders.module#OrdersModule'},
  {
    path: "admin",
    canActivate: [AuthGuard],
    loadChildren: "./admin/dashboard/dashboard.module#DashboardModule"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
