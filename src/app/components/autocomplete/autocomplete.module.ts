import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';


@NgModule({
  declarations: [ AutocompleteComponent ],
  exports: [
    AutocompleteComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AutocompleteModule {
}
