import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem } from '../../models/file.model';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="show"
      class="context-menu"
      [style.left.px]="position.x"
      [style.top.px]="position.y"
    >
      <div class="menu-item" (click)="onOpen()" *ngIf="file">
        <span class="material-icons">open_in_new</span>
        <span>Open</span>
      </div>
      
      <div class="menu-item" (click)="onCopy()">
        <span class="material-icons">content_copy</span>
        <span>Copy</span>
      </div>
      
      <div class="menu-item" (click)="onMove()">
        <span class="material-icons">drive_file_move</span>
        <span>Move to...</span>
      </div>
      
      <div class="menu-item" (click)="onRename()" *ngIf="file">
        <span class="material-icons">edit</span>
        <span>Rename</span>
      </div>
      
      <div class="menu-divider"></div>
      
      <div class="menu-item" (click)="onToggleFavorite()" *ngIf="file">
        <span class="material-icons">{{ file.favorite ? 'star' : 'star_outline' }}</span>
        <span>{{ file.favorite ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
      </div>
      
      <div class="menu-divider"></div>
      
      <div class="menu-item delete" (click)="onDelete()">
        <span class="material-icons">delete</span>
        <span>Delete</span>
      </div>
    </div>
  `,
  styles: [`
    .context-menu {
      position: fixed;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      min-width: 200px;
      z-index: 1000;
      padding: var(--spacing-1);
      animation: menuShow 0.1s ease-out;
    }
    
    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      cursor: pointer;
      border-radius: var(--radius-md);
      color: var(--neutral-700);
      transition: all var(--transition-fast);
      font-size: 0.875rem;
    }
    
    .menu-item:hover {
      background-color: var(--neutral-100);
      color: var(--neutral-900);
    }
    
    .menu-item .material-icons {
      font-size: 1.25rem;
    }
    
    .menu-item.delete {
      color: var(--error-600);
    }
    
    .menu-item.delete:hover {
      background-color: var(--error-50);
    }
    
    .menu-divider {
      height: 1px;
      background-color: var(--neutral-200);
      margin: var(--spacing-1) 0;
    }
    
    @keyframes menuShow {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class ContextMenuComponent {
  @Input() show: boolean = false;
  @Input() position: ContextMenuPosition = { x: 0, y: 0 };
  @Input() file: FileItem | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() open = new EventEmitter<void>();
  @Output() copy = new EventEmitter<void>();
  @Output() move = new EventEmitter<void>();
  @Output() rename = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();
  
  @HostListener('document:click')
  onDocumentClick() {
    if (this.show) {
      this.close.emit();
    }
  }
  
  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.show) {
      this.close.emit();
    }
  }
  
  onOpen() {
    this.open.emit();
    this.close.emit();
  }
  
  onCopy() {
    this.copy.emit();
    this.close.emit();
  }
  
  onMove() {
    this.move.emit();
    this.close.emit();
  }
  
  onRename() {
    this.rename.emit();
    this.close.emit();
  }
  
  onDelete() {
    this.delete.emit();
    this.close.emit();
  }
  
  onToggleFavorite() {
    this.toggleFavorite.emit();
    this.close.emit();
  }
}