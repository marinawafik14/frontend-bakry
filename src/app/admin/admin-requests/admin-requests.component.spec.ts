import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestsComponent } from './admin-requests.component';

describe('AdminRequestsComponent', () => {
  let component: AdminRequestsComponent;
  let fixture: ComponentFixture<AdminRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
