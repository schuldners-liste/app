import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { JoinComponent } from './join.component';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  {path: '', component: JoinComponent}
];

@NgModule({
  declarations: [JoinComponent, LoginFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class JoinModule {
}
