import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierOrdersComponent } from './cashier-orders.component';

describe('CashierOrdersComponent', () => {
  let component: CashierOrdersComponent;
  let fixture: ComponentFixture<CashierOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
