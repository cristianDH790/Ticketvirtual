import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  styles: [
    `
      .wrap {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      .title {
        font-size: 22px;
        font-weight: 900;
        letter-spacing: -0.4px;
        margin: 0;
      }
      .subtitle {
        margin: 4px 0 0 0;
        opacity: 0.75;
      }
      .spacer {
        flex: 1;
      }
    `,
  ],
  template: `
    <div class="wrap">
      <div>
        <h2 class="title">{{ title }}</h2>
        @if (subtitle) {
          <p class="subtitle">{{ subtitle }}</p>
        }
      </div>
      <span class="spacer"></span>
      <ng-content />
    </div>
  `,
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}

