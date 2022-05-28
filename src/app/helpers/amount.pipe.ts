import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount'
})
export class AmountPipe implements PipeTransform {

  transform(value: number): string {
    return (value % 1 === 0
      ? value
        .toString()
      : value
        .toFixed(2)
        .replace('.', ','))
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
