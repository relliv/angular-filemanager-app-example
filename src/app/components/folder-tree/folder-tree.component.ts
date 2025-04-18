import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileItem, FileType } from '../../models/file.model';

interface TreeNode {
  item: FileItem;
  expanded: boolean;
  children: TreeNode[];
  level: number;
  loading?: boolean;
  hasSubFolders?: boolean;
}

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="folder-tree">
      <div 
        *ngFor="let node of treeNodes" 
        class="tree-node"
        [style.paddingLeft.px]="node.level * 16"
      >
        <div 
          class="node-content"
          [class.selected]="node.item.id === selectedId"
          (click)="onNodeClick(node)"
        >
          <div class="node-indicator" [class.has-children]="node.hasSubFolders">
            <button 
              *ngIf="node.hasSubFolders"
              class="expand-btn"
              (click)="toggleNode($event, node)"
            >
              <span class="material-icons expand-icon" [class.expanded]="node.expanded">
                chevron_right
              </span>
            </button>
          </div>
          
          <span class="material-icons folder-icon">
            {{ node.expanded ? 'folder_open' : 'folder' }}
          </span>
          
          <span class="node-name">{{ node.item.name }}</span>
          
          <div class="loading-indicator" *ngIf="node.loading">
            <div class="spinner"></div>
          </div>
        </div>
        
        <div 
          class="node-children" 
          *ngIf="node.expanded && node.hasSubFolders"
          [@expandCollapse]="node.expanded ? 'expanded' : 'collapsed'"
        >
          <app-folder-tree
            [folders]="getChildFolders(node)"
            [selectedId]="selectedId"
            [level]="node.level + 1"
            (nodeSelect)="onChildNodeSelect($event)"
          ></app-folder-tree>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .folder-tree {
      user-select: none;
    }
    
    .tree-node {
      margin: var(--spacing-1) 0;
    }
    
    .node-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .node-content:hover {
      background-color: var(--neutral-100);
    }
    
    .node-content.selected {
      background-color: var(--primary-50);
      color: var(--primary-700);
    }
    
    .node-indicator {
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .node-indicator.has-children {
      cursor: pointer;
    }
    
    .expand-btn {
      padding: 2px;
      color: var(--neutral-600);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .expand-btn:hover {
      color: var(--neutral-900);
    }
    
    .expand-icon {
      font-size: 1.25rem;
      transition: transform var(--transition-fast);
    }
    
    .expand-icon.expanded {
      transform: rotate(90deg);
    }
    
    .folder-icon {
      color: var(--primary-500);
      font-size: 1.25rem;
    }
    
    .node-name {
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .node-children {
      margin-left: var(--spacing-2);
      animation: slideDown 0.2s ease-out;
    }
    
    .loading-indicator {
      margin-left: auto;
      padding-left: var(--spacing-2);
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--neutral-200);
      border-top-color: var(--primary-500);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class FolderTreeComponent {
  @Input() folders: FileItem[] = [];
  @Input() selectedId: string | null = null;
  @Input() level: number = 0;
  
  @Output() nodeSelect = new EventEmitter<FileItem>();
  
  treeNodes: TreeNode[] = [];
  
  ngOnInit() {
    this.buildTreeNodes();
  }
  
  ngOnChanges() {
    this.buildTreeNodes();
  }
  
  private buildTreeNodes() {
    this.treeNodes = this.folders
      .filter(folder => folder.type === FileType.FOLDER)
      .map(folder => {
        const children = this.getInitialChildren(folder);
        return {
          item: folder,
          expanded: false,
          children,
          level: this.level,
          hasSubFolders: children.length > 0
        };
      });
  }
  
  private getInitialChildren(folder: FileItem): TreeNode[] {
    const children = this.folders
      .filter(child => child.parentId === folder.id && child.type === FileType.FOLDER)
      .map(child => {
        const subChildren = this.folders
          .filter(subChild => subChild.parentId === child.id && subChild.type === FileType.FOLDER);
        
        return {
          item: child,
          expanded: false,
          children: [],
          level: this.level + 1,
          hasSubFolders: subChildren.length > 0
        };
      });
    
    return children;
  }
  
  hasChildren(node: TreeNode): boolean {
    return node.hasSubFolders || false;
  }
  
  getChildFolders(node: TreeNode): FileItem[] {
    return this.folders.filter(item => 
      item.parentId === node.item.id && 
      item.type === FileType.FOLDER
    );
  }
  
  onNodeClick(node: TreeNode) {
    this.nodeSelect.emit(node.item);
  }
  
  onChildNodeSelect(folder: FileItem) {
    this.nodeSelect.emit(folder);
  }
  
  toggleNode(event: MouseEvent, node: TreeNode) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
}