import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagingComponent } from './components/paging/paging.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';


@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagingComponent,
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    //Need forRoot to load the providers at app start up for Pagination to work.
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ],
  exports:[
    PaginationModule,
    PagingHeaderComponent,
    PagingComponent,
    CarouselModule,
    OrderSummaryComponent
  ]
})
export class SharedModule { }
