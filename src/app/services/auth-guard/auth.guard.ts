import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isLoggedIn: boolean;

  constructor(private router: Router,
              private auth: AuthService) {
    this.isLoggedIn = false;

    this.auth.isLoggedIn.subscribe(state => {
      this.isLoggedIn = state;
    });
  }

  canActivate(route: ActivatedRouteSnapshot & { _routerState: { url: string } }, state: RouterStateSnapshot): boolean {
    const redirectUrl = route._routerState.url;

    if (!this.isLoggedIn) {
      this.router.navigateByUrl(
        this.router.createUrlTree(
          ['/join'], {
            queryParams: {
              redirectUrl
            }
          }
        )
      );

      return false;
    } else {
      return true;
    }
  }
}
