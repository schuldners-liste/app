import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { DebtorService } from '../../services/debtor.service';
import { Debtor, Entry } from '../../models/models';

@Component({
  selector: 'app-entries',
  templateUrl: './debtors.component.html',
  styleUrls: [ './debtors.component.scss' ]
})
export class DebtorsComponent implements OnInit {

  debtors: Debtor[] | null;

  constructor(private header: HeaderService,
              private readonly entryService: DebtorService) {
    this.debtors = null;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.header.text = 'Debtors';
    });

    this.entryService.getDebtors().subscribe(debtors => {
      this.debtors = debtors.filter(debtor => debtor.entries.filter(e => !e.deleted).length > 0);
    });
  }

  calculateTotalAmount(entries: Entry[]): number {
    return entries.reduce((acc, entry) => acc + entry.amount, 0);
  }
}
