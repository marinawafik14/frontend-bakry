import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierCheckoutComponent } from './cashier-checkout.component';

describe('CashierCheckoutComponent', () => {
  let component: CashierCheckoutComponent;
  let fixture: ComponentFixture<CashierCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
