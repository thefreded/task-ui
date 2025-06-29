import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateFileName',
})
export class TruncateFileNamePipe implements PipeTransform {
  transform(name: string, maxLength: number = 30): string {
    if (!name || name.length <= maxLength) return name;

    const ext = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncated = nameWithoutExt.substring(0, maxLength - ext!.length - 4);

    return `${truncated}...${ext}`;
  }
}
