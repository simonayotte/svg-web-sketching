import { Component } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent {
  currentText: string;
  currentCategory: string;

  constructor() {
    this.currentText = 'bienvenue';
    this.currentCategory = '';
  }

  displayCategory(category: string): void {
    this.currentCategory = category;
  }

  displayTextSubject(subject: string): void {
    this.currentText = subject;
    switch (this.currentText) {
      case 'crayon':
      case 'pinceau':
      case 'ligne':
      case 'polygone':
      case 'ellipse':
      case 'pipette':
      case 'aerosol':
      case 'selection':
      case 'efface':
      case 'applicateur':
      case 'rectangle': {
        this.displayCategory('outils');
        break;
      }
      case 'sauvegarder':
        case 'exporter':
        case 'undoredo':
        case 'grille': {
          this.displayCategory('param');
          break;
        }
      default: {
        this.displayCategory('');
        break;
      }
    }
  }
}
