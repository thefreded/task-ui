import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appFileIcon]',
})
export class FileIcon {
  readonly #elementRef = inject(ElementRef);

  readonly fileName = input.required<string>({ alias: 'appFileIcon' });

  constructor() {
    effect(() => {
      const icon = this.#getFileIcon(this.fileName());
      this.#elementRef.nativeElement.textContent = icon;
    });
  }

  #getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap: { [key: string]: string } = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📝',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      gif: '🖼️',
      zip: '🗜️',
      xlsx: '📊',
      xls: '📊',
      ppt: '📊',
      pptx: '📊',
    };
    return iconMap[ext || ''] || '📎';
  }
}
