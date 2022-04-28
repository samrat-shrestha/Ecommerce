import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit {
  @Input() pageNumber : number;
  @Input() pageSize : number;
  @Input() totalProducts : number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
