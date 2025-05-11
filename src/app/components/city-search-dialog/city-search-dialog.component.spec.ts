import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySearchDialogComponent } from './city-search-dialog.component';

describe('CitySearchDialogComponent', () => {
  let component: CitySearchDialogComponent;
  let fixture: ComponentFixture<CitySearchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySearchDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitySearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
