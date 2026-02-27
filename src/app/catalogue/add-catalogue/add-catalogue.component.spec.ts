import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCatalogueComponent } from './add-catalogue.component';

describe('AddCatalogueComponent', () => {
  let component: AddCatalogueComponent;
  let fixture: ComponentFixture<AddCatalogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCatalogueComponent]
    });
    fixture = TestBed.createComponent(AddCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
