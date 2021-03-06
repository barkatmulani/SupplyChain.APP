import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const html = ``;

describe('Component: ng2-table', () => {
  let fixture:ComponentFixture<any>;
  let context:TestTableComponent;
  let element:any;
  let clean:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTableComponent],
    });
    TestBed.overrideComponent(TestTableComponent, {set: {template: html}});
    fixture = TestBed.createComponent(TestTableComponent);
    context = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('#c1');
    clean = fixture.nativeElement.querySelector('#c2');
    fixture.detectChanges();
  });

  it('should be true', () => {
    expect(true).toBe(true);
  });
});

@Component({
  selector: 'table-test',
  template: ''
})

class TestTableComponent {
}
