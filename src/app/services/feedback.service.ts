import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackComponent } from '../components/feedback/feedback.component';
import { Feedback } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private readonly data: Feedback[];

  constructor(private readonly snackBar: MatSnackBar) {
    this.data = [];

    // this.showInfoEvent('test', false);

    setTimeout(() => {
      // this.showInfoEvent('test', true);

      setTimeout(() => {
        // this.showInfoEvent('Entry could not be created', true);

        setTimeout(() => {
          // this.showInfoEvent('Entry created', false);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  public showInfoEvent(text: string, errorFeedback: boolean): void {
    if (this.data.length === 0) {
      this.openSnackBar();
    }

    this.data.push({ text, errorFeedback });

    setTimeout(() => {
      this.data.shift();

      if (this.data.length === 0) {
        this.closeSnackBar();
      }
    }, 5000);
  }

  private openSnackBar(): void {
    this.snackBar.openFromComponent(FeedbackComponent, {
      duration: 99999,
      verticalPosition: 'top',
      data: this.data
    });
  }

  private closeSnackBar(): void {
    this.snackBar.dismiss();
  }

}
