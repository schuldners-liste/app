import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: boolean;

  constructor(private auth: AngularFireAuth) {
    this.loggedIn = false;

    this.auth.user.subscribe(user => {
      this.loggedIn = !!user;
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

  public signOut(): ReturnType<firebase.auth.Auth['signOut']> {
    return this.auth.signOut();
  }

  public get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public signInWithEmailAndPasswort(email: string, password: string): ReturnType<firebase.auth.Auth['signInWithEmailAndPassword']> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
}
