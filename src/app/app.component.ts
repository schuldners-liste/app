import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              public auth: AuthService) {
  }

  ngOnInit(): void {
    let initDone = false;

    this.auth.isLoggedInState.subscribe(state => {
      let redirectUrl = '/entries';

      if (state) {
        this.route.queryParams.subscribe(value => {
          if (value.redirectUrl) {
            redirectUrl = value.redirectUrl;
          }
        });
      } else if (initDone) {
        redirectUrl = '/join';
      }

      this.router.navigateByUrl(redirectUrl, { replaceUrl: true })
        .catch(err => {
          console.error(err);
        });

      initDone = true;
    });
  }
}
