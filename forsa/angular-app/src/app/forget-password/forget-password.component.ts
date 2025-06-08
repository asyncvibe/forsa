import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { ToastrManager } from "ng6-toastr-notifications";
@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.css"]
})
export class ForgetPasswordComponent implements OnInit {
  firstParam: string;
  secondParam: String;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private user: UserService,
    private router: Router,
    public toastr: ToastrManager
  ) {}
  profileForm = this.fb.group({
    password: ["", Validators.required]
  });
  ngOnInit() {
    this.firstParam = this.route.snapshot.queryParamMap.get("authToken");
    this.secondParam = this.route.snapshot.queryParamMap.get("id");
  }
  onSubmit() {
    console.log("new password", this.profileForm.value);
    this.user
      .resetPassword(this.profileForm.value, this.firstParam, this.secondParam)
      .subscribe(
        data => {
          this.toastr.successToastr(data.message, "Success!");
        },
        error => {
          this.toastr.errorToastr(error.message, "Oops!");
        }
      );
  }
}
