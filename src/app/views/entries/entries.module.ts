import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntriesComponent } from './entries.component';

const routes: Routes = [
  {path: '', component: EntriesComponent}
];

@NgModule({
  declarations: [EntriesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EntriesModule { }
