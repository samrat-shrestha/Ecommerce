import { v4 as uuidv4 } from "uuid";

export interface IBasket{
    id : string;
    items : IBasketItem[]
}

export interface IBasketItem {
    id : number;
    productName : string;
    price : number;
    quantity : number;
    pictureUrl : string;
    brand : string;
    type : string;
}

//This class is used to initialize the id of the newly created object of basket later.
export class Basket implements IBasket{
    id = uuidv4();
    items: IBasketItem[] = [];
}

export interface IBasketTotals{
    shipping : number;
    subTotal : number;
    total : number;
}