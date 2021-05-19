import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'entries'
  },
  {
    path: 'join',
    loadChildren: () => import('./views/join/join.module').then(m => m.JoinModule)
  },
  {
    path: 'entries',
    loadChildren: () => import('./views/entries/entries.module').then(m => m.EntriesModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
