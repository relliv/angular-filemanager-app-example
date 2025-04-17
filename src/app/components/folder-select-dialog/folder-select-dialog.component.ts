import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file.model';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';

@Component({
  selector: 'app-folder-select-dialog',
  standalone: true,
  imports: [CommonModule, FolderTreeComponent],
  template: `
    <div class="dialog-overlay" (click)="onClose()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>Select Folder</h3>
          <button class="close-btn" (click)="onClose()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="dialog-content">
          <app-folder-tree
            [folders]="folders"
            [selectedId]="selectedFolderId"
            (nodeSelect)="onFolderSelect($event)"
          ></app-folder-tree>
        </div>
        
        <div class="dialog-footer">
          <button class="cancel-btn" (click)="onClose()">Cancel</button>
          <button 
            class="select-btn" 
            [disabled]="!selectedFolder"
            (click)="onSelect()"
          >
            Select Folder
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .dialog {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: dialogShow 0.2s ease-out;
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .dialog-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }
    
    .close-btn {
      padding: var(--spacing-1);
      color: var(--neutral-600);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    
    .close-btn:hover {
      background-color: var(--neutral-100);
      color: var(--neutral-900);
    }
    
    .dialog-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-4);
      min-height: 200px;
      max-height: 400px;
    }
    
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-2);
      padding: var(--spacing-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    .cancel-btn {
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-md);
      background-color: var(--neutral-100);
      color: var(--neutral-700);
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    
    .cancel-btn:hover {
      background-color: var(--neutral-200);
      color: var(--neutral-900);
    }
    
    .select-btn {
      padding: var(--spacing-2) var(--spacing-4);
      border-radius: var(--radius-md);
      background-color: var(--primary-500);
      color: white;
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    
    .select-btn:hover:not(:disabled) {
      background-color: var(--primary-600);
    }
    
    .select-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    @keyframes dialogShow {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @media (max-width: 768px) {
      .dialog {
        margin: var(--spacing-2);
      }
    }
  `]
})
export class FolderSelectDialogComponent {
  @Input() folders: FileItem[] = [];
  
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<FileItem>();
  
  selectedFolderId: string | null = null;
  selectedFolder: FileItem | null = null;
  
  onClose() {
    this.close.emit();
  }
  
  onFolderSelect(folder: FileItem) {
    this.selectedFolderId = folder.id;
    this.selectedFolder = folder;
  }
  
  onSelect() {
    if (this.selectedFolder) {
      this.select.emit(this.selectedFolder);
    }
  }
}