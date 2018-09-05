import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'keys',
  pure: false
})
export class KeysPipe implements PipeTransform {
  transform (value: any): any {
    return Object.keys(value)
  }
}
