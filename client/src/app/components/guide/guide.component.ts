import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
