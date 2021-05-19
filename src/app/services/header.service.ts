import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private readonly headerText: Subject<string>;

  constructor() {
    this.headerText = new Subject<string>();
  }

  public set text(newText: string) {
    this.headerText.next(newText.substring(0, 20));
  }

  public getText(): Observable<string> {
    return this.headerText;
  }
}
