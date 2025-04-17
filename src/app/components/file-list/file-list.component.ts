import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem, FileType } from '../../models/file.model';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { FileIconComponent } from '../file-icon/file-icon.component';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, FileSizePipe, FileIconComponent],
  template: `
    <div class="file-list">
      <table class="file-table">
        <thead>
          <tr>
            <th class="checkbox-col">
              <div class="checkbox-container">
                <input 
                  type="checkbox" 
                  id="select-all" 
                  [checked]="isAllSelected"
                  (change)="toggleSelectAll()"
                >
                <label for="select-all"></label>
              </div>
            </th>
            <th class="name-col">Name</th>
            <th class="modified-col">Modified</th>
            <th class="size-col">Size</th>
            <th class="actions-col"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            *ngFor="let file of files" 
            class="file-row"
            [class.selected]="isSelected(file)"
            (click)="onFileClick(file, $event)"
            (dblclick)="onFileDoubleClick(file, $event)"
          >
            <td class="checkbox-col">
              <div class="checkbox-container">
                <input 
                  type="checkbox" 
                  [id]="'select-' + file.id" 
                  [checked]="isSelected(file)"
                  (click)="$event.stopPropagation()"
                  (change)="onFileSelectToggle(file)"
                >
                <label [for]="'select-' + file.id"></label>
              </div>
            </td>
            <td class="name-col">
              <div class="file-info">
                <app-file-icon [fileType]="file.type" [extension]="file.extension"></app-file-icon>
                <span class="file-name">{{ file.name }}</span>
                <span *ngIf="file.favorite" class="favorite-icon material-icons">star</span>
              </div>
            </td>
            <td class="modified-col">{{ file.modifiedDate | date:'medium' }}</td>
            <td class="size-col">{{ file.type === 'folder' ? '-' : (file.size | fileSize) }}</td>
            <td class="actions-col">
              <div class="file-actions">
                <button class="action-icon" (click)="onMoreOptions(file, $event)">
                  <span class="material-icons">more_horiz</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .file-list {
      width: 100%;
      overflow-x: auto;
    }
    
    .file-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    
    .file-table th {
      text-align: left;
      padding: var(--spacing-2) var(--spacing-3);
      color: var(--neutral-600);
      font-weight: 500;
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .file-row {
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }
    
    .file-row:hover {
      background-color: var(--neutral-100);
    }
    
    .file-row.selected {
      background-color: var(--primary-50);
    }
    
    .file-row td {
      padding: var(--spacing-2) var(--spacing-3);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .checkbox-col {
      width: 40px;
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
    
    .name-col {
      min-width: 250px;
    }
    
    .modified-col {
      width: 180px;
    }
    
    .size-col {
      width: 80px;
    }
    
    .actions-col {
      width: 50px;
    }
    
    .file-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    .file-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    
    .favorite-icon {
      font-size: 1rem;
      color: var(--warning-500);
    }
    
    .file-actions {
      display: flex;
      justify-content: flex-end;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }
    
    .file-row:hover .file-actions {
      opacity: 1;
    }
    
    .action-icon {
      padding: var(--spacing-1);
      color: var(--neutral-600);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .action-icon:hover {
      background-color: var(--neutral-200);
      color: var(--neutral-900);
    }
    
    @media (max-width: 768px) {
      .modified-col,
      .size-col {
        display: none;
      }
      
      .file-actions {
        opacity: 1;
      }
    }
  `]
})
export class FileListComponent {
  @Input() files: FileItem[] = [];
  @Input() selectedFiles: FileItem[] = [];
  
  @Output() fileClick = new EventEmitter<FileItem>();
  @Output() fileDoubleClick = new EventEmitter<FileItem>();
  @Output() fileSelect = new EventEmitter<FileItem>();
  @Output() moreOptions = new EventEmitter<{file: FileItem, event: MouseEvent}>();
  
  get isAllSelected(): boolean {
    return this.files.length > 0 && this.selectedFiles.length === this.files.length;
  }
  
  isSelected(file: FileItem): boolean {
    return this.selectedFiles.some(f => f.id === file.id);
  }
  
  toggleSelectAll(): void {
    if (this.isAllSelected) {
      // Deselect all
      this.selectedFiles.forEach(file => {
        this.fileSelect.emit(file);
      });
    } else {
      // Select all
      this.files.forEach(file => {
        if (!this.isSelected(file)) {
          this.fileSelect.emit(file);
        }
      });
    }
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