import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { AppWeb } from "@capacitor/app/dist/esm/web";
import { IonRouterOutlet, Platform, provideIonicAngular } from "@ionic/angular";

import { Subscription } from "rxjs";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let backButtonHandlers: Map<number, (processNextHandler: () => void) => unknown>;
  let minimizeApp: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();

    backButtonHandlers = new Map();
    vi.spyOn(TestBed.inject(Platform).backButton, "subscribeWithPriority").mockImplementation((priority, callback) => {
      backButtonHandlers.set(priority, callback);
      return new Subscription();
    });
    // Outside a device the App plugin runs its web implementation.
    minimizeApp = vi.spyOn(AppWeb.prototype, "minimizeApp").mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function create() {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const outlet = fixture.debugElement.query(By.directive(IonRouterOutlet)).injector.get(IonRouterOutlet);
    return { fixture, outlet };
  }

  it("creates the app", () => {
    expect(create().fixture.componentInstance).toBeTruthy();
  });

  it("sends the app to the background on the back button when there is no page to go back to", async () => {
    const { outlet } = create();
    vi.spyOn(outlet, "canGoBack").mockReturnValue(false);

    backButtonHandlers.get(-1)?.(() => undefined);

    await vi.waitFor(() => expect(minimizeApp).toHaveBeenCalled());
  });

  it("keeps the app open when the back button goes back to a previous page", async () => {
    const { outlet } = create();
    vi.spyOn(outlet, "canGoBack").mockReturnValue(true);

    backButtonHandlers.get(-1)?.(() => undefined);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(minimizeApp).not.toHaveBeenCalled();
  });
});
