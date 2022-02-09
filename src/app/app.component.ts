import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { DebtorService } from './services/debtor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  loadingState: Observable<boolean>;
  isLoggedIn: Observable<boolean>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private loading: LoadingService,
              private entryService: DebtorService) {
    this.loadingState = loading.loadingState;
    this.isLoggedIn = auth.isLoggedInState;
  }

  ngOnInit(): void {
    this.auth.isLoggedInState.subscribe(state => {
      let redirectUrl: string | UrlTree = '/entries';

      this.loading.activateLoading();

      if (state) {
        this.entryService.fetchEntries();

        this.route.queryParams.subscribe(value => {
          if (value.redirectUrl) {
            redirectUrl = value.redirectUrl;
          }
        });
      } else {
        if (this.router.url !== '/signup') {
          this.route.queryParams.subscribe(value => {
            if (value.redirectUrl) {
              redirectUrl = this.router.createUrlTree(
                [ '/signin' ], {
                  queryParams: {
                    redirectUrl: value.redirectUrl
                  }
                }
              );
            } else {
              redirectUrl = '/signin';
            }
          });
        } else {
          redirectUrl = '/signup';
        }
      }

      this.router.navigateByUrl(redirectUrl, { replaceUrl: true })
        .then(() => this.loading.deactivateLoading())
        .catch(err => {
          console.error(err);
        });
    });
  }

  signOut(): void {
    this.auth.signOut();
  }
}
