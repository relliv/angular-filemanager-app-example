import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileItem } from '../../models/file.model';

@Component({
  selector: 'app-folder-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tabs-container">
      <div class="tabs-scroll">
        <div class="tabs">
          <div 
            *ngFor="let tab of openTabs" 
            class="tab"
            [class.active]="tab.id === activeTabId"
            (click)="onTabClick(tab)"
          >
            <span class="material-icons tab-icon">folder</span>
            <span class="tab-name">{{ tab.name }}</span>
            <button class="close-tab" (click)="onCloseTab($event, tab)">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs-container {
      background-color: var(--neutral-100);
      border-bottom: 1px solid var(--neutral-200);
      margin-bottom: var(--spacing-4);
    }
    
    .tabs-scroll {
      overflow-x: auto;
      padding: 0 var(--spacing-4);
    }
    
    .tabs {
      display: flex;
      gap: var(--spacing-1);
      min-height: 40px;
      padding: var(--spacing-2) 0;
    }
    
    .tab {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-3);
      background-color: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      min-width: 140px;
      max-width: 200px;
    }
    
    .tab:hover {
      background-color: white;
    }
    
    .tab.active {
      background-color: white;
      border-color: var(--primary-200);
      box-shadow: var(--shadow-sm);
    }
    
    .tab-icon {
      font-size: 1.25rem;
      color: var(--primary-500);
    }
    
    .tab-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.875rem;
    }
    
    .close-tab {
      padding: 2px;
      border-radius: var(--radius-sm);
      color: var(--neutral-500);
      opacity: 0;
      transition: all var(--transition-fast);
    }
    
    .tab:hover .close-tab {
      opacity: 1;
    }
    
    .close-tab:hover {
      background-color: var(--neutral-100);
      color: var(--neutral-900);
    }
    
    .close-tab .material-icons {
      font-size: 1rem;
    }
    
    @media (max-width: 768px) {
      .tabs-scroll {
        padding: 0 var(--spacing-2);
      }
      
      .tab {
        min-width: 120px;
      }
      
      .close-tab {
        opacity: 1;
      }
    }
  `]
})
export class FolderTabsComponent {
  @Input() openTabs: FileItem[] = [];
  @Input() activeTabId: string | null = null;
  
  @Output() tabClick = new EventEmitter<FileItem>();
  @Output() tabClose = new EventEmitter<FileItem>();
  
  onTabClick(tab: FileItem): void {
    this.tabClick.emit(tab);
  }
  
  onCloseTab(event: MouseEvent, tab: FileItem): void {
    event.stopPropagation();
    this.tabClose.emit(tab);
  }
}