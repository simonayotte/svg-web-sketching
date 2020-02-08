import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {
  currentText = 'bienvenue';

  ngOnInit() {
    this.displayTextSubject(this.currentText);
  }

  collapse(categoryId: string) {
    const category = document.getElementById(categoryId);
    const list = document.getElementById(categoryId + '-list');
    if (category != null && list != null) {
      if (list.style.display === 'block') {
        list.style.display = 'none';
      } else {
        list.style.display = 'block';
      }
    }
  }

  // impossible to do a 'for-of' loop, HTMLCollectionOf<Element> doesn't have a [Symbol.iterator]() method
  /*tslint:disable:prefer-for-of*/
  displayTextSubject(subjectId: string) {
    for (let i = 0; i < document.getElementsByClassName('subject-text').length; i++) {
      document.getElementsByClassName('subject-text')[i].setAttribute('style', 'none');
    }
    const newText = document.getElementById('page-' + subjectId);
    if (newText) {
      newText.style.display = 'block';
      this.currentText = subjectId;
    }

    this.resetContentTable();
    this.updateContentTable()
  }

  updateContentTable() {
    const categories = document.getElementsByClassName('category-items');
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].children.length; j++) {
        if (categories[i].children[j].children[0].id === this.currentText && document.getElementById(categories[i].id) != null) {
          document.getElementById(categories[i].id)!.style.display = 'block'; // tslint:disable-line:no-non-null-assertion
        }
      }
    }
  }

  resetContentTable() {
    const categories = document.getElementsByClassName('category-items');
    for (let i = 0; i < categories.length; i++) {
      if (document.getElementById(categories[i].id) != null) {
        document.getElementById(categories[i].id)!.style.display = 'none'; // tslint:disable-line:no-non-null-assertion
      }
    }
  }
}
