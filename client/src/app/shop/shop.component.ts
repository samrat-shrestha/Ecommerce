import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';
import { IType } from '../shared/models/type';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  //static true means that this element is not dependent upon other actions.
  @ViewChild('search', {static : true}) searchTerm : ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  pageSize : number;
  totalProducts : number;
  shopParams = new ShopParams();
  sortOptions = [
    {name : 'Alphabetical', value : 'name'},
    {name : 'Price : Low to High', value : 'priceAsc'},
    {name : 'Price : High to Low', value : 'priceDesc'}
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProductData();

    this.getBrandData();

    this.getTypeData();
  }

  getProductData() {
    this.shopService.getProducts(this.shopParams)
      .subscribe((response) => {
        // this.pageSize =  (response.pageSize > response.count) ? response.count : response.pageSize;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalProducts = response.count;
        this.products = response.data;
        console.log(response);
      }), error => {
        console.log(error);
      };
  }

  getBrandData() {
    this.shopService.getBrands().subscribe(response => {
      this.brands = [{id: 0, name:'All'}, ...response];
      console.log(this.brands);
    }), error => {
      console.log(error);
    };
  }

  getTypeData() {
    this.shopService.getTypes().subscribe(response => {
      this.types = [{id: 0, name:'All'}, ...response];
      console.log(this.types);
    }), error => {
      console.log(error);
    };
  }

  onBrandSelected(brandId : number)
  {
    console.log(1);
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;

    this.getProductData();
  }

  onTypeSelected(typeId : number)
  {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;

    this.getProductData();
  }

  onSortSelected(sort : string)
  {
    this.shopParams.sort = sort;
    this.getProductData();
  }

  onPageChanged(event : any)
  {
    console.log(2);
    //Here we set the pagenumber as an output of pagin component.
    if(this.shopParams.pageNumber != event.page)
    {
      this.shopParams.pageNumber = event.page;
      this.getProductData();
    }
  }

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;

    this.getProductData();
  }

  onReset(){
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProductData()
  }
}
