import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserEditComponent } from './admin-user-edit.component';

describe('AdminUserEditComponent', () => {
  let component: AdminUserEditComponent;
  let fixture: ComponentFixture<AdminUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
