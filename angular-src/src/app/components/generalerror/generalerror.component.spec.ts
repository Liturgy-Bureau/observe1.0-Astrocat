import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralerrorComponent } from './generalerror.component';

describe('GeneralerrorComponent', () => {
  let component: GeneralerrorComponent;
  let fixture: ComponentFixture<GeneralerrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralerrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
