import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClerckComponent } from './clerck.component';

describe('ClerckComponent', () => {
  let component: ClerckComponent;
  let fixture: ComponentFixture<ClerckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClerckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClerckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
