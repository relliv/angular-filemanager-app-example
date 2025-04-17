import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file.model';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { FileIconComponent } from '../file-icon/file-icon.component';

@Component({
  selector: 'app-file-grid',
  standalone: true,
  imports: [CommonModule, FileSizePipe, FileIconComponent],
  template: `
    <div class="file-grid">
      <div 
        *ngFor="let file of files" 
        class="file-card"
        [class.selected]="isSelected(file)"
        (click)="onFileClick(file, $event)"
        (dblclick)="onFileDoubleClick(file, $event)"
      >
        <div class="file-card-select">
          <div class="checkbox-container">
            <input 
              type="checkbox" 
              [id]="'grid-select-' + file.id" 
              [checked]="isSelected(file)"
              (click)="$event.stopPropagation()"
              (change)="onFileSelectToggle(file)"
            >
            <label [for]="'grid-select-' + file.id"></label>
          </div>
        </div>
        
        <div class="file-thumbnail">
          <app-file-icon 
            [fileType]="file.type" 
            [extension]="file.extension" 
            [thumbnail]="file.thumbnail"
            [size]="'large'"
          ></app-file-icon>
          
          <button 
            *ngIf="file.favorite" 
            class="favorite-btn"
          >
            <span class="material-icons">star</span>
          </button>
        </div>
        
        <div class="file-details">
          <div class="file-name" [title]="file.name">{{ file.name }}</div>
          <div class="file-meta">
            <span>{{ file.modifiedDate | date:'MMM d' }}</span>
            <span *ngIf="file.type !== 'folder'">{{ file.size | fileSize }}</span>
          </div>
        </div>
        
        <div class="file-card-actions">
          <button class="action-btn" (click)="onMoreOptions(file, $event)">
            <span class="material-icons">more_vert</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: var(--spacing-4);
      padding: var(--spacing-2);
    }
    
    .file-card {
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-md);
      border: 2px solid transparent;
      transition: all var(--transition-fast);
      cursor: pointer;
      animation: fadeIn 0.3s ease-out;
    }
    
    .file-card:hover {
      background-color: var(--neutral-100);
    }
    
    .file-card.selected {
      border-color: var(--primary-500);
      background-color: var(--primary-50);
    }
    
    .file-card-select {
      position: absolute;
      top: var(--spacing-2);
      left: var(--spacing-2);
      z-index: 2;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }
    
    .file-card:hover .file-card-select,
    .file-card.selected .file-card-select {
      opacity: 1;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .checkbox-container input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkbox-container label {
      position: relative;
      display: inline-block;
      width: 18px;
      height: 18px;
      background-color: white;
      border: 1px solid var(--neutral-300);
      border-radius: 3px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .checkbox-container input[type="checkbox"]:checked + label {
      background-color: var(--primary-500);
      border-color: var(--primary-500);
    }
    
    .checkbox-container input[type="checkbox"]:checked + label:after {
      content: "";
      position: absolute;
      display: block;
      left: 6px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .file-thumbnail {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3);
      height: 100px;
    }
    
    .favorite-btn {
      position: absolute;
      top: var(--spacing-2);
      right: var(--spacing-2);
      border: none;
      background: transparent;
      color: var(--warning-500);
      cursor: pointer;
    }
    
    .file-details {
      padding: var(--spacing-2);
      text-align: center;
    }
    
    .file-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: var(--spacing-1);
    }
    
    .file-meta {
      display: flex;
      justify-content: center;
      gap: var(--spacing-2);
      font-size: 0.75rem;
      color: var(--neutral-600);
    }
    
    .file-card-actions {
      position: absolute;
      top: var(--spacing-2);
      right: var(--spacing-2);
      opacity: 0;
      transition: opacity var(--transition-fast);
      z-index: 2;
    }
    
    .file-card:hover .file-card-actions {
      opacity: 1;
    }
    
    .action-btn {
      padding: var(--spacing-1);
      color: var(--neutral-600);
      background: rgba(255, 255, 255, 0.8);
      border: none;
      border-radius: var(--radius-sm);
      backdrop-filter: blur(2px);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .action-btn:hover {
      background-color: white;
      color: var(--neutral-900);
    }
    
    @media (max-width: 768px) {
      .file-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: var(--spacing-3);
      }
      
      .file-thumbnail {
        height: 80px;
      }
      
      .file-card-actions {
        opacity: 1;
      }
    }
  `]
})
export class FileGridComponent {
  @Input() files: FileItem[] = [];
  @Input() selectedFiles: FileItem[] = [];
  
  @Output() fileClick = new EventEmitter<FileItem>();
  @Output() fileDoubleClick = new EventEmitter<FileItem>();
  @Output() fileSelect = new EventEmitter<FileItem>();
  @Output() moreOptions = new EventEmitter<{file: FileItem, event: MouseEvent}>();
  
  isSelected(file: FileItem): boolean {
    return this.selectedFiles.some(f => f.id === file.id);
  }
  
  onFileClick(file: FileItem, event: MouseEvent): void {
    if (!event.ctrlKey && !event.metaKey) {
      this.fileClick.emit(file);
    } else {
      this.onFileSelectToggle(file);
    }
  }
  
  onFileDoubleClick(file: FileItem, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileDoubleClick.emit(file);
  }
  
  onFileSelectToggle(file: FileItem): void {
    this.fileSelect.emit(file);
  }
  
  onMoreOptions(file: FileItem, event: MouseEvent): void {
    event.stopPropagation();
    this.moreOptions.emit({ file, event });
  }
}