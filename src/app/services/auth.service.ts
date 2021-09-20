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

  signUpWithEmailAndPassword(email: string, username: string, password: string): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password).then(res => {
        // TODO: insert stuff into db here
        resolve(res);
      }).catch(err => {
        const messages: { message: string; feedback: string }[] = [
          {
            message: 'The password is invalid or the user does not have a password.',
            feedback: 'Ungültiges Passwort oder E-Mail.'
          },
          {
            message: 'Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later',
            feedback: 'Der Anmelde Vorgang ist zu oft fehlgeschlagen, versuchen Sie es später erneut.'
          },
          {
            message: 'There is no user record corresponding to this identifier. The user may have been deleted.',
            feedback: 'Es wurde kein Account mit der E-Mail Adresse gefunden.'
          },
          {
            message: 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.',
            feedback: 'Zeitüberschreitung. Versuchen Sie es später erneut.'
          },
          {
            message: 'The email address is already in use by another account.',
            feedback: 'Die angebene E-Mail Adresse wird bereits verwendet.'
          }
        ];

        for (const message of messages) {
          if (err.message === message.message) {
            err.message = message.feedback;
          }
        }
        reject(err);
      });
    });
  }
}
