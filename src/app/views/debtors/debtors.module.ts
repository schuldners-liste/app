import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtorsComponent } from './debtors.component';
import { MatIconModule } from '@angular/material/icon';
import { DetailComponent } from './detail/detail.component';
import { HelpersModule } from '../../helpers/helpers.module';
import { EditComponent } from './edit/edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: DebtorsComponent
  },
  {
    path: ':name',
    component: DetailComponent
  }
];

@NgModule({
  declarations: [ DebtorsComponent, DetailComponent, EditComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatDialogModule,
    HelpersModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule
  ]
})
export class DebtorsModule {
}
