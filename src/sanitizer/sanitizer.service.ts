import { Injectable } from '@nestjs/common';
import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

@Injectable()
export class SanitizerService {
  private window = new JSDOM('').window;
  private DOMPurify = DOMPurify(
    this.window as unknown as Window & typeof globalThis,
  );

  sanitize(html: string): string {
    return this.DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });
  }
}
