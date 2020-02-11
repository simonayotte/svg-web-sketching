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

  collapse(category: string) {
    this.currentCategory = category;
  }

  displayTextSubject(subject: string) {
    this.currentText = subject;
  }
}
