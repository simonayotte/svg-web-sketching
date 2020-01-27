import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit { 

  currentText = "bienvenue";
  constructor() {
  }

  ngOnInit() {
    this.displayTextSubject(this.currentText);
  }

  collapse(category_id:string) {
    let category = document.getElementById(category_id);
    let list = document.getElementById(category_id + "-list");
    if (category != null && list != null){
      if (list.style.display === "block"){
        list.style.display = "none";
      }
      else {
        list.style.display = "block";
      }
    }
  }

  displayTextSubject(subject_id:string) {
    for (let i = 0; i < document.getElementsByClassName("subject-text").length; i++){
      document.getElementsByClassName("subject-text")[i].setAttribute("style","none");
    }
    let newText = document.getElementById("page-" + subject_id);
    if (newText) {
      newText.style.display="block";
      this.currentText = subject_id;
    }

    this.resetContentTable();
    this.updateContentTable()
  }

  updateContentTable() {
    let categories = document.getElementsByClassName("category-items");
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].children.length; j++) {
        if (categories[i].children[j].children[0].id == this.currentText) document.getElementById(categories[i].id)!.style.display = "block";
      }
    }
  }

  resetContentTable() {
    let categories = document.getElementsByClassName("category-items");
    for (let i = 0; i < categories.length; i++) {
      if (document.getElementById(categories[i].id) != null) document.getElementById(categories[i].id)!.style.display = "none";
    }
  }
}
