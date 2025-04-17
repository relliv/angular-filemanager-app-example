import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trash-page">
      <div class="trash-header">
        <h2>Trash</h2>
      </div>
      
      <div class="trash-empty">
        <div class="trash-empty-content">
          <span class="material-icons trash-icon">delete_outline</span>
          <h3>Trash is empty</h3>
          <p>Items in trash will be automatically deleted after 30 days</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .trash-page {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .trash-header {
      margin-bottom: var(--spacing-4);
    }
    
    .trash-header h2 {
      margin: 0;
    }
    
    .trash-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
    
    .trash-empty-content {
      text-align: center;
      animation: fadeIn 0.5s ease-out;
    }
    
    .trash-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-3);
      color: var(--neutral-400);
    }
    
    .trash-empty h3 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-2);
      color: var(--neutral-800);
    }
    
    .trash-empty p {
      color: var(--neutral-600);
    }
  `]
})
export class TrashComponent {
  // This is a placeholder component with minimal functionality
  // In a full implementation, this would display deleted files
  // and allow for restoration or permanent deletion
}