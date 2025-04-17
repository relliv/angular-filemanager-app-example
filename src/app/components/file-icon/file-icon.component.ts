import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileType } from '../../models/file.model';

@Component({
  selector: 'app-file-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-icon" [class.large]="size === 'large'">
      <div *ngIf="thumbnail; else iconTemplate" class="thumbnail-container">
        <img [src]="thumbnail" alt="File thumbnail" class="thumbnail">
      </div>
      
      <ng-template #iconTemplate>
        <span class="material-icons" [ngClass]="iconClass">{{ getIcon() }}</span>
        <span *ngIf="extension && size === 'large'" class="extension-label">{{ extension }}</span>
      </ng-template>
    </div>
  `,
  styles: [`
    .file-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      position: relative;
    }
    
    .file-icon.large {
      width: 64px;
      height: 64px;
    }
    
    .material-icons {
      font-size: 1.75rem;
    }
    
    .file-icon.large .material-icons {
      font-size: 2.5rem;
    }
    
    .folder-icon {
      color: var(--primary-500);
    }
    
    .image-icon {
      color: var(--accent-500);
    }
    
    .document-icon {
      color: var(--primary-600);
    }
    
    .spreadsheet-icon {
      color: var(--success-500);
    }
    
    .presentation-icon {
      color: var(--warning-500);
    }
    
    .pdf-icon {
      color: var(--error-500);
    }
    
    .video-icon {
      color: var(--primary-700);
    }
    
    .audio-icon {
      color: var(--warning-500);
    }
    
    .archive-icon {
      color: var(--neutral-700);
    }
    
    .code-icon {
      color: var(--accent-500);
    }
    
    .other-icon {
      color: var(--neutral-600);
    }
    
    .extension-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 0.625rem;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 1px 0;
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
      text-transform: uppercase;
    }
    
    .thumbnail-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: var(--radius-sm);
    }
    
    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `]
})
export class FileIconComponent {
  @Input() fileType: FileType = FileType.OTHER;
  @Input() extension?: string;
  @Input() thumbnail?: string;
  @Input() size: 'normal' | 'large' = 'normal';
  
  get iconClass(): string {
    return `${this.fileType}-icon`;
  }
  
  getIcon(): string {
    switch (this.fileType) {
      case FileType.FOLDER:
        return 'folder';
      case FileType.IMAGE:
        return 'image';
      case FileType.DOCUMENT:
        return 'description';
      case FileType.SPREADSHEET:
        return 'table_chart';
      case FileType.PRESENTATION:
        return 'slideshow';
      case FileType.PDF:
        return 'picture_as_pdf';
      case FileType.VIDEO:
        return 'videocam';
      case FileType.AUDIO:
        return 'audiotrack';
      case FileType.ARCHIVE:
        return 'inventory_2';
      case FileType.CODE:
        return 'code';
      default:
        return 'insert_drive_file';
    }
  }
}