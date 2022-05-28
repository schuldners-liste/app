import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../../models/models';
import { DebtorService } from '../../services/debtor.service';
import { HeaderService } from '../../services/header.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CustomValidators } from '../../helpers/custom-validators';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: [ './create.component.scss' ]
})
export class CreateComponent implements OnInit {

  isMoney: boolean;
  debtorControl: FormControl;
  dateControl: FormControl;
  repeatControl: FormControl;
  reasonControl: FormControl;
  objectControl: FormControl;
  amountControl: FormControl;
  autocompleteState: boolean;
  autocompleteOptions: string[];
  selectedDebtors: string[];
  separatorKeysCodes: number[];

  constructor(private readonly header: HeaderService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly feedbackService: FeedbackService,
              private readonly entryService: DebtorService) {
    this.isMoney = false;
    this.autocompleteState = false;
    this.autocompleteOptions = [];
    this.selectedDebtors = [];
    this.separatorKeysCodes = [ ENTER, COMMA ];

    this.debtorControl = new FormControl('', CustomValidators.debtorsAmountValidator(this.selectedDebtors));

    this.dateControl = new FormControl(this.currentDate, [
      Validators.required
    ]);

    this.amountControl = new FormControl('', [
      Validators.required
    ]);

    this.objectControl = new FormControl('', [
      Validators.required
    ]);

    this.repeatControl = new FormControl('', [
      Validators.required
    ]);

    this.reasonControl = new FormControl('', [
      Validators.required
    ]);
  }

  get currentDate(): string {
    const date = new Date();

    return `${ date.getFullYear() }-${ `0${ date.getMonth() + 1 }`.slice(-2) }-${ `0${ date.getDate() }`.slice(-2) }`;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.header.text = 'Create';
    });

    this.route.url.subscribe(url => {
      this.isMoney = url[0].path === 'money';
    });

    this.entryService.getDebtorNames().subscribe(value => {
      this.autocompleteOptions = value;
    });
  }

  create(): void {
    if (this.isValid()) {
      const entry: Entry = {
        id: Date.now(),
        date: this.dateControl.value,
        amount: parseFloat(this.amountControl.value),
        reason: this.reasonControl.value as string,
        repeat: {},
        restored: false,
        edited: false,
        deleted: false
      };

      if (!this.isMoney) {
        entry.object = this.objectControl.value as string;
      }

      this.selectedDebtors.forEach(debtor => {
        this.entryService.create(entry, debtor).then(() => {
          this.feedbackService.showInfoEvent('Entry created', false);

          this.router.navigateByUrl('/debtors');
        });
      });
    }
  }

  isValid(): boolean {
    return this.debtorControl.valid
    && this.dateControl.valid
    // && this.repeatControl.valid
    && this.reasonControl.valid
    && this.amountControl.valid
    && this.isMoney ? true : this.objectControl.valid;
  }

  public handleBlur(): void {
    setTimeout(() => {
      this.autocompleteState = false;
    });
  }

  removeSelectedDebtor(debtorName: string): void {
    const index = this.selectedDebtors.indexOf(debtorName);

    if (index >= 0) {
      this.autocompleteOptions.push(debtorName);
      this.selectedDebtors.splice(index, 1);
      this.debtorControl.setValue(this.debtorControl.value);
    }
  }

  add(value: string): void {
    if (value.trim() && !this.selectedDebtors.includes(value)) {
      this.autocompleteOptions = this.autocompleteOptions.filter(option => option !== value);
      this.selectedDebtors.push(value.trim());
      this.debtorControl.setValue('');
    }
  }
}
