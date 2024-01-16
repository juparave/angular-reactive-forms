import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './components/form/form.component';

import { MatCardModule } from '@angular/material/card';
import { NestedFormComponent } from './components/nested-form/nested-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'form',
    pathMatch: 'full'
  },
  {
    path: 'form',
    component: FormComponent,
  },
  {
    path: 'nested-form',
    component: NestedFormComponent,
  }
];

@NgModule({
  imports: [
    MatCardModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
