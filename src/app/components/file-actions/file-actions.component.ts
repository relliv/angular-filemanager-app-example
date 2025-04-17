import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { FolderSelectDialogComponent } from '../folder-select-dialog/folder-select-dialog.component';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file-actions',
  standalone: true,
  imports: [CommonModule, FolderSelectDialogComponent],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('200ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="file-actions-container" [@slideIn]="selectedFiles.length">
      <div class="file-actions-content">
        <div class="selected-info">
          <span>{{ selectedFiles.length }} {{ selectedFiles.length === 1 ? 'item' : 'items' }} selected</span>
          <button class="clear-btn" (click)="onClearSelection()">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="action-buttons">
          <button 
            class="action-btn" 
            (click)="onOpenFile()"
            *ngIf="selectedFiles.length === 1"
          >
            <span class="material-icons">open_in_new</span>
            <span class="btn-text">Open</span>
          </button>
          
          <button 
            class="action-btn" 
            (click)="onRenameFile()"
            *ngIf="selectedFiles.length === 1"
          >
            <span class="material-icons">edit</span>
            <span class="btn-text">Rename</span>
          </button>
          
          <button 
            class="action-btn favorite-btn" 
            (click)="onToggleFavorite()"
            *ngIf="selectedFiles.length === 1"
          >
            <span class="material-icons">{{ selectedFiles[0].favorite ? 'star' : 'star_outline' }}</span>
            <span class="btn-text">{{ selectedFiles[0].favorite ? 'Unfavorite' : 'Favorite' }}</span>
          </button>
          
          <button 
            class="action-btn" 
            (click)="showMoveDialog()"
          >
            <span class="material-icons">drive_file_move</span>
            <span class="btn-text">Move</span>
          </button>
          
          <button 
            class="action-btn" 
            (click)="onCopyFiles()"
          >
            <span class="material-icons">file_copy</span>
            <span class="btn-text">Copy</span>
          </button>
          
          <button 
            class="action-btn delete-btn" 
            (click)="onDeleteFiles()"
          >
            <span class="material-icons">delete</span>
            <span class="btn-text">Delete</span>
          </button>
        </div>
      </div>
    </div>

    <app-folder-select-dialog
      *ngIf="showFolderSelect"
      [folders]="allFolders"
      (close)="closeMoveDialog()"
      (select)="onMoveFiles($event)"
    ></app-folder-select-dialog>
  `,
  styles: [`
    .file-actions-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: var(--spacing-3);
      z-index: 100;
      display: flex;
      justify-content: center;
    }
    
    .file-actions-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--neutral-900);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      color: white;
      max-width: 900px;
      width: 100%;
    }
    
    .selected-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    .clear-btn {
      background: transparent;
      border: none;
      color: var(--neutral-400);
      cursor: pointer;
      transition: color var(--transition-fast);
      padding: var(--spacing-1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .clear-btn:hover {
      color: white;
    }
    
    .action-buttons {
      display: flex;
      gap: var(--spacing-2);
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-md);
      background-color: transparent;
      color: var(--neutral-200);
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: 0.875rem;
    }
    
    .action-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .delete-btn:hover {
      background-color: rgba(var(--error-500), 0.2);
      color: white;
    }
    
    .favorite-btn.active {
      color: var(--warning-500);
    }
    
    @media (max-width: 768px) {
      .file-actions-container {
        padding: var(--spacing-2);
      }
      
      .file-actions-content {
        padding: var(--spacing-2) var(--spacing-3);
        flex-direction: column;
        gap: var(--spacing-2);
        align-items: flex-start;
      }
      
      .action-buttons {
        width: 100%;
        overflow-x: auto;
        padding-bottom: var(--spacing-1);
        justify-content: space-between;
      }
      
      .btn-text {
        display: none;
      }
      
      .action-btn {
        padding: var(--spacing-1);
      }
    }
  `]
})
export class FileActionsComponent {
  @Input() selectedFiles: FileItem[] = [];
  
  @Output() clearSelection = new EventEmitter<void>();
  @Output() openFile = new EventEmitter<FileItem>();
  @Output() renameFile = new EventEmitter<FileItem>();
  @Output() deleteFiles = new EventEmitter<void>();
  @Output() moveFiles = new EventEmitter<string | null>();
  @Output() copyFiles = new EventEmitter<string | null>();
  @Output() toggleFavorite = new EventEmitter<FileItem>();
  
  showFolderSelect = false;
  allFolders: FileItem[] = [];
  
  constructor(private fileService: FileService) {
    this.fileService.getFilesInFolder(null).subscribe(folderContent => {
      this.allFolders = folderContent.items;
    });
  }
  
  onClearSelection(): void {
    this.clearSelection.emit();
  }
  
  onOpenFile(): void {
    if (this.selectedFiles.length === 1) {
      this.openFile.emit(this.selectedFiles[0]);
    }
  }
  
  onRenameFile(): void {
    if (this.selectedFiles.length === 1) {
      this.renameFile.emit(this.selectedFiles[0]);
    }
  }
  
  onDeleteFiles(): void {
    this.deleteFiles.emit();
  }
  
  showMoveDialog(): void {
    this.showFolderSelect = true;
  }
  
  closeMoveDialog(): void {
    this.showFolderSelect = false;
  }
  
  onMoveFiles(targetFolder: FileItem): void {
    this.moveFiles.emit(targetFolder.id);
    this.showFolderSelect = false;
  }
  
  onCopyFiles(): void {
    // In a real app, this would open a folder picker dialog
    // For demo purposes, we'll just copy to the root folder
    this.copyFiles.emit(null);
  }
  
  onToggleFavorite(): void {
    if (this.selectedFiles.length === 1) {
      this.toggleFavorite.emit(this.selectedFiles[0]);
    }
  }
}