import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { KeysPipe } from "./keys.pipe";

@NgModule({
  declarations: [KeysPipe],
  exports: [KeysPipe],
  imports: [CommonModule],
})
export class SharedModule {}
