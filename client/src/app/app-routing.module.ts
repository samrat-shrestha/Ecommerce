import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BadRequestComponent } from './core/bad-request/bad-request.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { HomeComponent } from './home/home.component';
import { ProdutDetailsComponent } from './shop/produt-details/produt-details.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  // {path:'shop', component:ShopComponent},
  // {path:'shop/:id', component:ProdutDetailsComponent},
  {path:'not-found', component:NotFoundComponent},
  {path:'server-error', component:ServerErrorComponent},
  {path:'bad-request', component:BadRequestComponent},
  {path:'shop', loadChildren : () => import('./shop/shop.module').then(mod => mod.ShopModule)},
  {path:'basket', loadChildren : () => import('./basket/basket.module').then(bas => bas.BasketModule)},
  {path:'checkout', loadChildren : () => import('./checkout/checkout.module').then(che => che.CheckoutModule)},
  {path:'**', redirectTo:'', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
