import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighbourhoodComponent } from './neighbourhood.component';

describe('NeighbourhoodComponent', () => {
  let component: NeighbourhoodComponent;
  let fixture: ComponentFixture<NeighbourhoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeighbourhoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeighbourhoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
