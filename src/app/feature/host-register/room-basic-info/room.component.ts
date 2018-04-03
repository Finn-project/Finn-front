import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  rooms = ['개인실', '다인실'];
  capacities = ['최대 1명 숙박 가능', '최대 2명 숙박 가능',
                '최대 3명 숙박 가능', '최대 4명 숙박 가능'];
  constructor() { }

  ngOnInit() {
  }

}
