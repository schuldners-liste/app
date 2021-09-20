import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ './signup.component.scss' ]
})
export class SignupComponent implements OnInit {

  emailControl: FormControl;
  usernameControl: FormControl;
  passwordControl: FormControl;
  repeatPasswordControl: FormControl;
  responseError: string | undefined;

  constructor(private auth: AuthService,
              private loading: LoadingService) {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ]);

    this.usernameControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(20)
    ]);

    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/[a-z]/),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[0-9]/),
      Validators.minLength(6)
    ]);

    this.repeatPasswordControl = new FormControl('', [
      Validators.required
    ]);
  }

  ngOnInit(): void {
  }

  signup(): void {
    if (this.emailControl.valid
      && this.usernameControl.valid
      && this.passwordControl.valid
      && this.repeatPasswordControl.valid
      && this.repeatPasswordControl.value === this.passwordControl.value) {
      this.loading.activateLoading();

      this.auth.signUpWithEmailAndPassword(this.emailControl.value, this.usernameControl.value, this.passwordControl.value)
        .then(res => {
          this.responseError = undefined;
        }).catch(err => {
        this.loading.deactivateLoading();
        this.responseError = err.message;
      });
    }
  }

}
