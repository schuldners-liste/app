import { Component, OnInit } from '@angular/core';
import { DebtorService } from '../../../services/debtor.service';
import { Debtor, Entry } from '../../../models/models';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../services/header.service';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { FeedbackService } from '../../../services/feedback.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: [ './detail.component.scss' ]
})
export class DetailComponent implements OnInit {

  public debtor: Debtor | null;
  public entries: Entry[];
  public searchCondition: string;

  constructor(private readonly headerService: HeaderService,
              private readonly debtorService: DebtorService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly dialog: MatDialog,
              private readonly feedback: FeedbackService) {
    this.debtor = null;
    this.searchCondition = '';
    this.entries = [];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.debtorService.getDebtorByName(params.name).subscribe(debtor => {
        if (debtor) {
          this.debtor = debtor;

          this.debtor.entries = this.debtor.entries.filter(e => !e.deleted);
          this.entries = this.debtor.entries;

          if (this.debtor.entries.length === 0) {
            this.router.navigateByUrl('/debtors');
          }

          setTimeout(() => {
            this.headerService.text = `Entries of ${ debtor.name }`;
          });
        }
      });
    });
  }

  openDialog(entry: Entry): void {
    this.dialog.open(EditComponent, {
      data: entry
    }).afterClosed().subscribe(result => {
      if (result && this.debtor) {
        this.debtorService.update(this.debtor.name, result)
          .then(() => this.feedback.showInfoEvent('Entry updated', false))
          .catch(() => this.feedback.showInfoEvent('Update failed', true));
      }
    });
  }

  public delete(entry: Entry): void {
    if (this.debtor) {
      this.debtorService.delete(this.debtor.name, entry.id).then(() => {
        this.feedback.showInfoEvent('Entry deleted', false);
      });
    }
  }

  public getEntryStateText(entry: Entry): string {
    const stateParts: string[] = [];

    if (entry.restored) {
      stateParts.push('restored');
    }

    if (entry.edited) {
      stateParts.push('edited');
    }

    return `(${ stateParts.join(' & ') })`;
  }

  public searchConditionChange(): void {
    if (this.debtor) {
      this.entries = this.debtor?.entries.filter(e => {
        return (e.object?.toLowerCase().includes(this.searchCondition.toLowerCase())
          || e.date.toLowerCase().includes(this.searchCondition.toLowerCase())
          || e.reason.toLowerCase().includes(this.searchCondition.toLowerCase())
          || e.amount.toString().toLowerCase().includes(this.searchCondition.toLowerCase()));
      }) || [];
    }
  }
}
