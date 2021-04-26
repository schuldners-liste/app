import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'schuldners-liste';
  loggedIn = false;

  constructor(private auth: AuthService) {
    // auth.signInWithEmailAndPasswort('dev@dorfingerjonas.at', 'Developer123!').then(value => {
    //   console.log(value);
    // });

    auth.signOut().then(() => {
      // auth.googleAuth();
    });
  }
}
