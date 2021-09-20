import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private state: boolean;
  private readonly loadingActive: Subject<boolean>;

  constructor() {
    this.state = false;
    this.loadingActive = new Subject<boolean>();
  }

  get loadingState(): Observable<boolean> {
    return this.loadingActive;
  }

  activateLoading(): void {
    this.state = true;
    this.loadingActive.next(this.state);
  }

  deactivateLoading(): void {
    this.state = false;
    this.loadingActive.next(this.state);
  }

  toggleLoading(): void {
    this.state = !this.state;
    this.loadingActive.next(this.state);
  }
}
