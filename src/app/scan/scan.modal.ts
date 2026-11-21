import { Component, inject, type OnDestroy, type OnInit, signal } from "@angular/core";

import type { PluginListenerHandle } from "@capacitor/core";
import { BarcodeFormat, BarcodeScanner, Resolution } from "@capacitor-mlkit/barcode-scanning";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  ModalController,
} from "@ionic/angular";

// The Aztec code of the certificate is too dense for the lower resolutions of
// ML Kit; see "Barcode scanner" in AGENTS.md.
const RESOLUTION = Resolution["3840x2160"];

const ZOOM_LEVELS = [1, 1.5, 2, 3];

const ZOOM_STORAGE_KEY = "scanner.zoom";

@Component({
  selector: "app-scan-modal",
  templateUrl: "scan.modal.html",
  styleUrl: "scan.modal.scss",
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
  ],
})
export class ScanModalComponent implements OnInit, OnDestroy {
  private readonly modalController = inject(ModalController);

  private listener?: PluginListenerHandle;

  private done = false;

  readonly zoomLevels = signal<number[]>([1]);

  readonly zoom = signal(1);

  readonly torchAvailable = signal(false);

  readonly torch = signal(false);

  async ngOnInit(): Promise<void> {
    // The camera preview is rendered behind the WebView, so everything but this
    // modal has to be transparent; see global.scss.
    document.body.classList.add("barcode-scanner-active");

    this.listener = await BarcodeScanner.addListener("barcodesScanned", ({ barcodes }) => {
      const text = barcodes[0]?.rawValue;
      if (text) {
        void this.close(text);
      }
    });
    await BarcodeScanner.startScan({ formats: [BarcodeFormat.Aztec], resolution: RESOLUTION });

    const { zoomRatio: max } = await BarcodeScanner.getMaxZoomRatio();
    this.zoomLevels.set(ZOOM_LEVELS.filter((level) => level <= max));
    this.torchAvailable.set((await BarcodeScanner.isTorchAvailable()).available);

    const saved = Number(localStorage.getItem(ZOOM_STORAGE_KEY));
    if (this.zoomLevels().includes(saved)) {
      await this.setZoom(saved);
    }
  }

  async ngOnDestroy(): Promise<void> {
    document.body.classList.remove("barcode-scanner-active");
    await this.stop();
  }

  zoomLabel(level: number): string {
    return `${level.toLocaleString("pl-PL")}×`;
  }

  async setZoom(level: number): Promise<void> {
    await BarcodeScanner.setZoomRatio({ zoomRatio: level });
    this.zoom.set(level);
    localStorage.setItem(ZOOM_STORAGE_KEY, String(level));
  }

  async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
    this.torch.set((await BarcodeScanner.isTorchEnabled()).enabled);
  }

  async close(text?: string): Promise<void> {
    if (this.done) {
      return;
    }
    this.done = true;
    await this.stop();
    await this.modalController.dismiss(text);
  }

  private async stop(): Promise<void> {
    await this.listener?.remove();
    this.listener = undefined;
    await BarcodeScanner.stopScan();
  }
}
