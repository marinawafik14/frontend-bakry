import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersofflineComponent } from './ordersoffline.component';

describe('OrdersofflineComponent', () => {
  let component: OrdersofflineComponent;
  let fixture: ComponentFixture<OrdersofflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersofflineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersofflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
