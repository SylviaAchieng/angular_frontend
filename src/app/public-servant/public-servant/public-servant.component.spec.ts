import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicServantComponent } from './public-servant.component';

describe('PublicServantComponent', () => {
  let component: PublicServantComponent;
  let fixture: ComponentFixture<PublicServantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicServantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicServantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
