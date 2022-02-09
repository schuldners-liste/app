import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DebtorService } from '../../../services/debtor.service';
import { Entry } from '../../../models/models';
import { MatDialogRef } from '@angular/material/dialog/';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: [ './edit.component.scss' ]
})
export class EditComponent implements OnInit {

  dateControl: FormControl;
  repeatControl: FormControl;
  reasonControl: FormControl;
  objectControl: FormControl;
  amountControl: FormControl;

  constructor(private entryService: DebtorService,
              private readonly dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public entry: Entry) {
    this.dateControl = new FormControl(this.convertDate(this.entry.date), [
      Validators.required
    ]);

    this.amountControl = new FormControl(entry.amount, [
      Validators.required
    ]);

    this.objectControl = new FormControl(entry.object, [
      Validators.required
    ]);

    this.repeatControl = new FormControl(entry.repeat, [
      Validators.required
    ]);

    this.reasonControl = new FormControl(entry.reason, [
      Validators.required
    ]);
  }

  ngOnInit(): void {
  }

  save(): void {
    if (this.isValid()) {
      const entry: Entry = {
        id: this.entry.id,
        date: this.dateControl.value,
        amount: parseFloat(this.amountControl.value),
        reason: this.reasonControl.value as string,
        repeat: {},
        edited: true
      };

      if (this.entry.object) {
        entry.object = this.objectControl.value as string;
      }

      this.dialogRef.close(entry);
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  isValid(): boolean {
    return this.dateControl.valid
    && this.reasonControl.valid
    && this.amountControl.valid
    && !this.entry.object ? true : this.objectControl.valid;
  }

  convertDate(dateString: string): string {
    const parts = dateString.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

    return `${ date.getFullYear() }-${ `0${ date.getMonth() + 1 }`.slice(-2) }-${ `0${ date.getDate() }`.slice(-2) }`;
  }
}
