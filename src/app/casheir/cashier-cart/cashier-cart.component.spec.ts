import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierCartComponent } from './cashier-cart.component';

describe('CashierCartComponent', () => {
  let component: CashierCartComponent;
  let fixture: ComponentFixture<CashierCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
