import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private currentText: string;
  private readonly headerText: Subject<string>;

  constructor() {
    this.currentText = '';
    this.headerText = new Subject<string>();
  }

  public get text(): string {
    return this.currentText;
  }

  public set text(newText: string) {
    this.currentText = newText.substring(0, 20);
    this.headerText.next(this.currentText);
  }

  public getTextAsObservable(): Observable<string> {
    return this.headerText;
  }
}
