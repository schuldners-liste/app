import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Entry } from '../../models/models';
import { DebtorService } from '../../services/debtor.service';
import { HeaderService } from '../../services/header.service';

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

  constructor(private header: HeaderService,
              private route: ActivatedRoute,
              private entryService: DebtorService) {
    this.isMoney = false;
    this.autocompleteState = false;
    this.autocompleteOptions = [];

    this.debtorControl = new FormControl('', [
      Validators.required
    ]);

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
        deleted: false,
      };

      if (!this.isMoney) {
        entry.object = this.objectControl.value as string;
      }

      console.log(entry);

      this.entryService.create(entry, this.debtorControl.value).then(console.log);
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
}
