import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  it("creates the app", async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
