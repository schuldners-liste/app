import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: [ './signin.component.scss' ]
})
export class SigninComponent implements OnInit {

  emailControl: FormControl;
  passwordControl: FormControl;
  responseError: string | undefined;

  constructor(private auth: AuthService,
              private loading: LoadingService) {
    this.emailControl = new FormControl('', [
      Validators.required
    ]);

    this.passwordControl = new FormControl('', [
      Validators.required
    ]);
  }

  ngOnInit(): void {
  }

  login(): void {
    if (this.emailControl.valid && this.passwordControl.valid) {
      this.loading.activateLoading();

      this.auth.signInWithEmailAndPassword(this.emailControl.value, this.passwordControl.value).then(res => {
      }).catch(err => {
        this.loading.deactivateLoading();
        this.responseError = err.message;
      });
    }
  }
}
