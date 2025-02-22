import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierCategoryComponent } from './cashier-category.component';

describe('CashierCategoryComponent', () => {
  let component: CashierCategoryComponent;
  let fixture: ComponentFixture<CashierCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
