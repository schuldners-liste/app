import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ]
})
export class JoinModule {
}
