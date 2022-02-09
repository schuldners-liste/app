import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: [ './autocomplete.component.scss' ]
})
export class AutocompleteComponent implements OnChanges {

  @Input() options!: string[];
  @Input() currentValue!: string;
  @Output() selectedValue: EventEmitter<string>;
  displayOptions: string[];

  constructor() {
    this.selectedValue = new EventEmitter<string>();
    this.displayOptions = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentValue) {
      this.displayOptions = this.options
        .filter(value => value.includes(this.currentValue))
        .sort((a, b) => (a < b ? -1 : 1));
    }
  }

  click(name: string): void {
    this.selectedValue.emit(name);
  }
}
