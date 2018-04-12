import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { isNumber } from 'util';

export type PageState = 'room' | 'bedroom'
| 'bathroom' | 'location' | 'amentities' | 'spaces'
| 'picture' | 'description' | 'accommodationName'
| 'maximumReservationDate' | 'minimumReservationDate' |'price';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

//#region variable(변수)
  // 편의물품 { 구분 / 내용 / 사용가능 }
  amentities = [
    { name: 'essentials', content: '필수품목', available: false },
    { name: 'wifi', content: '무선인터넷', available: false },
    { name: 'shampoo', content: '샴푸', available: false },
    { name: 'tv', content: 'TV', available: false },
    { name: 'heater', content: '난방', available: false },
    { name: 'ac', content: '에어컨', available: false },
    { name: 'breakfast', content: '조식', available: false },
    { name: 'iron', content: '다리미', available: false },
    { name: 'hair-dryer', content: '헤어드라이어', available: false },
  ];

  // 편의시설 { 구분 / 내용 / 사용가능 }
  spaces = [
    { name: 'pool', content: '수영장', available: false },
    { name: 'kitchen', content: '주방', available: false },
    { name: 'washer', content: '세탁기', available: false },
    { name: 'parking-lot', content: '주차장', available: false },
    { name: 'elevator', content: '엘리베이터', available: false },
  ];

  // 주소 입력 { 구분 / 타입 / 내용}
  locationFields = [
    { name: '국가', type: 'nation', content: '' },
    { name: '시/도', type: 'state', content: '' },
    { name: '시/군', type: 'city', content: '' },
    { name: '도로명/건물번호/건물이름', type: 'street', content: '' },
    { name: '우편번호', type: 'zipcode', content: '' }
  ];

  // 현재 페이지의 상태
  pageStates: PageState[] = ['room', 'bedroom', 'bathroom',
    'location', 'amentities', 'spaces', 'picture', 'description',
    'accommodationName', 'maximumReservationDate', 'minimumReservationDate', 'price'];

  // 카운팅 될 페이지의 pagenumber
  stateCount = 0;
  // current page number
  currentState: PageState = this.pageStates[this.stateCount];

  // 방 개수
  roomCounts = ['방 1개', '방 2개', '방 3개', '방 4개'];
  // 최대 숙박가능 인원
  roomCapacities = ['최대 1명 숙박 가능', '최대 2명 숙박 가능',
    '최대 3명 숙박 가능', '최대 4명 숙박 가능'];
  // 방의 종류
  roomCategories = ['주택', '아파트', '별채', '호텔'];

  // 침대 종류
  bedroomTypes = ['싱글사이즈', '더블사이즈', '킹사이즈', '퀸사이즈', '아기침대'];
  // 침대 개수
  bedroomCount = 0;

  // 욕실(화장실)개수
  bathroomCount = 0;

  // 최소 숙박일
  minNightCount = 0;
  // 최대 숙박일
  maxNightCount = 0;
  // 숙박 제한일
  maximumNightCount = 10;

  // page에 따른 진척도 %표시
  progressbarPercentage = 10;

  // available-setting
  availableDates = ['항상', '3개월', '6개월', '9개월', '1년'];

  // 숙박일 validator
  reservationForm: FormGroup;

  // 위도 / 경도 / 확대정도 / 주소 / 우편번호 / 요청한 주소배열크기 / 요청할 주소
  latitude = 37.49794199999999;
  longitude = 127.027621;
  zoom = 15;
  formattedLocation = '';
  zipcode = '';
  zipcodeLength = 0;
  location: string;

  apiUrl = 'http://localhost:5500';

  form: FormGroup;
  loading = false;
  hideBtn = true;
  imageSrc = '/assets/images/john-resig.jpeg';

  result; // file upload 수행 이후 서버로부터 수신한 데이터

  constructor(
    private fb: FormBuilder,
    private http: HttpClient) {
    this.form = this.fb.group({
      avatar: ['', Validators.required]
    });
  }

  onFileChange(files: FileList) {
    if (files && files.length > 0) {
      // For Preview
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // 실험

      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      this.avatar.setValue(file.name);
      this.hideBtn = false;
    }
  }

  onSubmit(files: FileList) {
    const formData = new FormData();
    formData.append('avatar', files[0]);

    this.loading = true;
    // Send data (payload = formData)
    console.log(formData.get('avatar'));

    // 폼데이터를 서버로 전송한다.
    this.http.post(`${this.apiUrl}/upload`, formData)
      .subscribe(res => {
        this.result = res;
        this.loading = false;
        this.avatar.setValue(null);
      });
  }

  get avatar() {
    return this.form.get('avatar');
  }

  // returnFileSize(number) {
  //   if (number < 1024) {
  //     return number + 'bytes';
  //   } else if (number > 1024 && number < 1048576) {
  //     return (number / 1024).toFixed(1) + 'KB';
  //   } else if (number > 1048576) {
  //     return (number / 1048576).toFixed(1) + 'MB';
  //   }
  // }

//#region 함수모음(function)

  // 최소숙박수를 입력받아 number로 변경해서 저장
  changeMinNightCount(event: string) {
    const checkNum = /[0-9]+/g;
    const formattedNum = event.match(checkNum).join('');
    const parseNumber = parseInt(formattedNum, 10);
    const absNum = Math.abs(parseNumber);
    this.minNightCount = absNum;
  }

  // 최대숙박수를 입력받아 number로 변경해서 저장
  changeMaxNightCount(event: string) {
    const checkNum = /[0-9]+/g;
    const formattedNum = event.match(checkNum).join('');
    const parseNumber = parseInt(formattedNum, 10);
    const absNum = Math.abs(parseNumber);
    this.maxNightCount = absNum;
  }

  onMaxNightInputbox() {

  }

  onMinxNightInputbox () {

  }

  uploadPhoto () {
    const upload = document.getElementById('upload-photo');
    upload.click();
  }

  // google map GEO(위도,경도 및 요청정보) 얻기
  findLocation(location: string) {
    this.location = location;
    this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: 'AIzaSyCxXp7uUGDn2FCzjDg5j5Z-AQlCxcTLOdM'
      }
    })
    .subscribe(response => {
      console.dir(response);
      const resLength = response.results[0].address_components.length;
      for (let i = 0; i < 5; i++) {
        this.locationFields[i].content = '';
      }
      for (let j = 0; j < resLength; j++ ) {
        this.locationFields[j].content = response.results[0].address_components[j].long_name;
      }
      this.zipcodeLength = response.results[0].address_components.length;
      this.formattedLocation = response.results[0].formatted_address;
      this.zipcode = response.results[0].address_components[this.zipcodeLength - 1].long_name;
      this.latitude = response.results[0].geometry.location.lat;
      this.longitude = response.results[0].geometry.location.lng;
    });
  }

  // 현재 페이지를 변경
  changePageState () {
    switch (this.currentState) {
      case 'room': this.currentState = this.pageStates[this.stateCount]; break;
      case 'bedroom': this.currentState = this.pageStates[this.stateCount]; break;
      case 'bathroom': this.currentState = this.pageStates[this.stateCount]; break;
      case 'location': this.currentState = this.pageStates[this.stateCount]; break;
      case 'amentities': this.currentState = this.pageStates[this.stateCount]; break;
      case 'spaces': this.currentState = this.pageStates[this.stateCount]; break;
      default: this.currentState = this.pageStates[this.stateCount]; break;
    }
  }

  // 뒤로 버튼
  backPageState () {
    if (this.stateCount > 0) {
      this.stateCount--;
      const progressBar = document.getElementById('progressbar');
      if (this.progressbarPercentage > 0) {
        this.progressbarPercentage -= 10;
        progressBar.style.width = this.progressbarPercentage + '%';
      }
      this.changePageState();
    }
  }

  // 다음 버튼
  nextPageState () {
    if (this.stateCount < 11) {
      this.stateCount++;
      const progressBar = document.getElementById('progressbar');
      if (this.progressbarPercentage < 100) {
        this.progressbarPercentage += 10;
        progressBar.style.width = this.progressbarPercentage + '%';
      }
      this.changePageState();
    }
  }

  // 침대 개수 증가
  increaseBedroomCount () {
    this.bedroomCount++;
  }

  // 침대 개수 감소
  decreaseBedroomCount () {
    if (this.bedroomCount > 0 ) {
      this.bedroomCount--;
    }
  }

  // 침실 개수 증가
  increaseBathroomCount() {
    this.bathroomCount++;
  }

  // 침실 개수 감소
  decreaseBathroomCount() {
    if (this.bathroomCount > 0) {
      this.bathroomCount--;
    }
  }


  // 최소 숙박일수 증가
  increaseMinNight() {
    this.minNightCount++;
  }

  // 최소 숙박일수 감소
  decreaseMinNight() {
    if (this.minNightCount > 0) {
      this.minNightCount--;
    }
  }

  // 최대 숙박일수 증가
  increaseMaxNight() {
    this.maxNightCount++;
  }

  // 최대 숙박일수 감소
  decreaseMaxNight() {
    if (this.maxNightCount > 0) {
      this.maxNightCount--;
    }
  }

  ngOnInit() {
    this.reservationForm = new FormGroup({
      formControls: new FormGroup({})
    });
    console.dir(this.reservationForm);
  }

  //#endregion

}
