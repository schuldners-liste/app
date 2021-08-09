import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loggedInState: Subject<boolean>;
  private loggedIn: boolean;

  constructor(private auth: AngularFireAuth) {
    this.loggedInState = new Subject<boolean>();
    this.loggedIn = false;

    this.auth.user.subscribe(user => {
      this.loggedIn = !!user;
      this.loggedInState.next(this.loggedIn);
    });
  }

  // Sign in with Google
  googleAuth(): any {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  private authLogin(provider: any): any {
    return this.auth.signInWithPopup(provider)
      .then((result: UserCredential) => {
        console.log(result);
      }).catch((error) => {
        window.alert(error);
      });
  }

  get isLoggedInState(): Observable<boolean> {
    return this.loggedInState;
  }

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  signOut(): ReturnType<firebase.auth.Auth['signOut']> {
    return this.auth.signOut();
  }

  signInWithEmailAndPassword(email: string, password: string): ReturnType<firebase.auth.Auth['signInWithEmailAndPassword']> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
}
