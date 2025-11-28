import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Artistes } from './artistes';

describe('Artistes', () => {
  let component: Artistes;
  let fixture: ComponentFixture<Artistes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Artistes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Artistes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
