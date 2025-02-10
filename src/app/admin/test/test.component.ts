import { Component, OnInit } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [NgxDatatableModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent implements OnInit {
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
    { name: 'James', gender: 'Male', company: 'McDonald\'s' },
    { name: 'Sarah', gender: 'Female', company: 'Tesla' },
    { name: 'Michael', gender: 'Male', company: 'Google' },
    { name: 'Emma', gender: 'Female', company: 'Facebook' },
    { name: 'Liam', gender: 'Male', company: 'Amazon' },
    { name: 'Olivia', gender: 'Female', company: 'Microsoft' },
    { name: 'Noah', gender: 'Male', company: 'Apple' }
  ];

  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];

  pageSize = 5;  // Number of rows per page
  currentPage = 0;
  displayRows:any = [];

  ngOnInit() {
    this.updateDisplayedRows();
  }

  // Function to handle page changes
  onPageChange(event: any) {
    this.currentPage = event.offset;
    this.updateDisplayedRows();
  }

  // Function to slice data for pagination
  updateDisplayedRows() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayRows = this.rows.slice(start, end);
  }
}
