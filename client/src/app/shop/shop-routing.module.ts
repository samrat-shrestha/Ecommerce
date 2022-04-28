import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProdutDetailsComponent } from './produt-details/produt-details.component';
import { ShopComponent } from './shop.component';

const routes : Routes = [
  {path:'', component:ShopComponent},
  {path:':id', component:ProdutDetailsComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ShopRoutingModule { }
