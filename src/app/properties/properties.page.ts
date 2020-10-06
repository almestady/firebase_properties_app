import { Component, OnInit } from '@angular/core';
import { LanguagesService, Labels } from '../languages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit {
labels: Labels;

  constructor(
    private languageService: LanguagesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.languageService.arabicLabel.subscribe(labels => {this.labels = labels ; });
  }
  
  onSearch(){
    this.router.navigate(['/properties/tabs/discover']);
  }

  onOffers(){
    this.router.navigate(['/properties/tabs/offers']);
  }

  onRequest(){
    this.router.navigate(['/properties/tabs/request']);
  }
}
