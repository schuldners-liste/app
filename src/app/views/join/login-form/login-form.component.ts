import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  emailControl: FormControl;
  passwordControl: FormControl;

  constructor(private auth: AuthService) {
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
      this.auth.signInWithEmailAndPassword(this.emailControl.value, this.passwordControl.value).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err.message);
      });
    } else {
      console.log('foisch');
    }
  }
}
