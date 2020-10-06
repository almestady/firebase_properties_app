import { Component, OnInit } from '@angular/core';
import { LanguagesService, Labels } from 'src/app/languages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  labelsSub: Subscription;
  labels: Labels;
  
  constructor(
    private languageService: LanguagesService
  ) { }

  ngOnInit() {
    this.labelsSub = this.languageService.arabicLabel.subscribe(
      labels => (this.labels = labels)
    );
  }

}
