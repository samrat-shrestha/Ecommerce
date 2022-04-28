import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  //As we will be requiring the basket data in shop module, qty icon in home page and other places so we have used behaviour subject.
  private basketSource = new BehaviorSubject<IBasket>(null);

  //This is a public property that links with basketSource that will be accessible to other components.
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http : HttpClient) { }

  getBasket(id : string)
  {
    return this.http.get(this.baseUrl + 'Basket?basketid=' + id).pipe(
      map((basket : IBasket) => {
        this.basketSource.next(basket);
        console.log(this.getCurrentBasketValue());
        this.calculateTotals();
      })
    );
  }

  setBasket(basket : IBasket)
  {
    //set the new value and update the value of basketSource.
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response : IBasket)=>{
      this.basketSource.next(response);
      console.log('basketSource',response);
      this.calculateTotals();
    }), error=>{
      console.log(error);
    };
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    //a is like a tempTotal value we declare inside a for loop to store and add the price * qty which is intially 0.
    const subTotal = basket.items.reduce((a,b) => (b.price * b.quantity) + a, 0);

    const total = shipping + subTotal;

    this.basketTotalSource.next({shipping, total, subTotal});
  }

  addItemToBasket(item : IProduct, quantity = 1)
  {
    const itemToAdd : IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    //Either get the basket stored in Redis or create a new basket if new user.
    const basket = this.getCurrentBasketValue() ?? this.createBasket();

    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);

    this.setBasket(basket);
  }

  incrementItemQuantity(item : IBasketItem)
  {
    const basket = this.getCurrentBasketValue();

    const foundItemIndex = basket.items.findIndex(z=>z.id == item.id);

    if(foundItemIndex != -1)
    {
      basket.items[foundItemIndex].quantity += 1;
    }

    this.setBasket(basket);
  }

  decrementItemQuantity(item : IBasketItem)
  {
    const basket = this.getCurrentBasketValue();

    const foundItemIndex = basket.items.findIndex(z=>z.id == item.id);

    if(basket.items[foundItemIndex].quantity > 1)
    {
      basket.items[foundItemIndex].quantity-=1;
      this.setBasket(basket);
    }
    else
    {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();

    if(basket.items.some(z=>z.id == item.id))
    {
      basket.items = basket.items.filter(z=>z.id != item.id);

      if(basket.items.length > 0)
      {
        this.setBasket(basket);
      }
      else
      {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'Basket?basketid=' + basket.id).subscribe(()=>{
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }),error=>{
      console.log(error);
    };
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(z=>z.id == itemToAdd.id);

    if(index == -1)
    {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    else
    {
      items[index].quantity += quantity;
    }

    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    //storing the created basket in the browser local storage.
    //localStorage persists even if the browser is closed or PC is restarted. However, this storage is browser specific.
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item : IProduct, quantity : number) : IBasketItem{
    return {
      id:item.id,
      productName : item.name,
      price : item.price,
      quantity : quantity,
      pictureUrl : item.pictureUrl,
      brand : item.productBrand,
      type : item.productType
    };
  }
}
