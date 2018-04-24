import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],

})
export class NotFoundComponent implements OnInit {
  show : boolean;
  constructor() { }

  ngOnInit() {
  }
  footer() {
    this.show = !this.show;
  }
}
