import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Debtor, Entry } from '../models/models';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebtorService {

  private readonly debtorSubject = new BehaviorSubject<Debtor[]>([]);

  constructor(private db: AngularFireDatabase,
              private auth: AuthService) {
    this.debtorSubject = new BehaviorSubject<Debtor[]>([]);
  }

  fetchEntries(): void {
    this.db.list<Debtor>(`users/${ this.auth.uid }/debtors`)
      .valueChanges()
      .subscribe(debtors => {
        debtors.forEach(debtor => {
          const entries: Entry[] = [];

          for (const key in debtor.entries) {
            if (debtor.entries.hasOwnProperty(key)) {
              entries.push(debtor.entries[key]);
            }
          }

          debtor.entries = entries;
        });

        this.debtorSubject.next(debtors);
      });
  }

  getDebtors(): Observable<Debtor[]> {
    return this.debtorSubject.asObservable();
  }

  create(entry: Entry, debtor: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.object(`users/${ this.auth.uid }/debtors/${ debtor }/entries/${ entry.id }`)
        .set(entry)
        .then(() => {
          this.db.object(`users/${ this.auth.uid }/debtors/${ debtor }/name`)
            .set(debtor)
            .then(() => {
              resolve();
            });
        })
        .catch(reason => {
          reject(reason);
        });
    });
  }

  getDebtorNames(): Observable<string[]> {
    return new Observable<string[]>(subscriber => {
      subscriber.next(this.debtorSubject.value.map(debtor => debtor.name));

      this.getDebtors().subscribe(debtors => {
        subscriber.next(debtors.map(debtor => debtor.name));
      });
    });
  }

  getDebtorByName(debtorName: string): Observable<Debtor | null> {
    return new Observable<Debtor | null>(subscriber => {
      subscriber.next(this.debtorSubject.value.find(debtor => debtor.name.toLowerCase() === debtorName) || null);

      this.getDebtors().subscribe(debtors => {
        subscriber.next(debtors.find(debtor => debtor.name.toLowerCase() === debtorName) || null);
      });
    });
  }

  update(debtorName: string, entry: Entry): Promise<void> {
    return this.db.object(`users/${ this.auth.uid }/debtors/${ debtorName }/entries/${ entry.id }`)
      .update(entry);
  }

  delete(debtorName: string, id: number): Promise<void> {
    return this.db.object(`users/${ this.auth.uid }/debtors/${ debtorName }/entries/${ id }`).update({
      deleted: true
    });
  }
}
