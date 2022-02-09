import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create.component';
import { AutocompleteModule } from '../../components/autocomplete/autocomplete.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'money'
  },
  {
    path: 'money',
    component: CreateComponent
  },
  {
    path: 'object',
    component: CreateComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [ CreateComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    AutocompleteModule
  ]
})
export class CreateModule {
}
