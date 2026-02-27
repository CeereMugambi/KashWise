import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCatalogueComponent } from './edit-catalogue.component';

describe('EditCatalogueComponent', () => {
  let component: EditCatalogueComponent;
  let fixture: ComponentFixture<EditCatalogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCatalogueComponent]
    });
    fixture = TestBed.createComponent(EditCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
