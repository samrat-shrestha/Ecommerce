import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-produt-details',
  templateUrl: './produt-details.component.html',
  styleUrls: ['./produt-details.component.scss']
})
export class ProdutDetailsComponent implements OnInit {
  product : IProduct;
  quantity : number = 1;

  constructor(private shopService : ShopService, private activatedRoute : ActivatedRoute, private basketService : BasketService) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  addItemToCart(){
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity(){
    this.quantity+=1;
  }

  decrementQuantity(){
    if(this.quantity > 1)
    {
      this.quantity-=1;
    }
  }

  loadProduct(){
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(product => {
      this.product = product;
    }), error => {
      console.log(error);
    };
  }
}
