import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin.component';

const routes: Routes = [
  {
    path: '',
    component: SigninComponent
  }
];

@NgModule({
  declarations: [ SigninComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class SigninModule {
}
