import { Component } from '@angular/core';
import { FullModalService } from './core/service/full-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FullModalService]
})
export class AppComponent {
  constructor(private fullModal: FullModalService) {}

  get open() {
    return this.fullModal.getIsOpen;
  }
}
