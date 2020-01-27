import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {

  

  constructor() {
    
  }

  ngOnInit() {
    this.displayTextSubject("bienvenue");
  }


  collapse(category_id:string) {
    let category = document.getElementById(category_id);
    let list = document.getElementById(category_id + "-list");
    if (category != null && list != null){
      category.classList.toggle("active");
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
    if (newText) newText.style.display="block";
  }

}
