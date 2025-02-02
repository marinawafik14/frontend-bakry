import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashbordComponent } from './admin-dashbord.component';

describe('AdminDashbordComponent', () => {
  let component: AdminDashbordComponent;
  let fixture: ComponentFixture<AdminDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashbordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
