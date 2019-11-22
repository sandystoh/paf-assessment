import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome.component';
import { ListComponent } from './components/list.component';
import { FormComponent } from './components/form.component';


const ROUTES: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'list', component: ListComponent},
  { path: 'upload', component: FormComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(ROUTES, {
  scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload',
  useHash: true
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
