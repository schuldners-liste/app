import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private headerText: string[] = [];

  constructor() {
  }

  public set(newText: string): void {
    this.headerText[0] = newText.substring(0, 20);
  }

  public get text(): Observable<string[]> {
    return of(this.headerText);
  }
}
