import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  currentText = 'bienvenue';
  currentCategory = '';

  ngOnInit() {
  }

  displayCategory(category: string) {
    this.currentCategory = category;
  }

  displayTextSubject(subject: string) {
    this.currentText = subject;
    switch(this.currentText) {
      case 'crayon':
      case 'pinceau':
      case 'ligne':
      case 'rectangle': {
        this.displayCategory('outils');
        break;
      }
      default: {
        this.displayCategory('');
        break;
      }
    }
  }
}
