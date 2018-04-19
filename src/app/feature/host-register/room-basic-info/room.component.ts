import { Component, OnInit, ChangeDetectorRef, ViewChild,
  ElementRef, NgZone, ViewChildren, AfterViewInit, QueryList, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';

export type PageState = 'room' | 'bedroom'
| 'bathroom' | 'location' | 'amenities' | 'spaces'
| 'picture' | 'description' | 'accommodationName'
  | 'maximumCheckInRange' | 'minMaxReservationDate' |'price';

interface LocationData {
  country: string;
  city: string;
  district: string;
  dong: string;
  address1: string;
  premise: string;
  political:string;
  locality: string;
  administrative_area_level_1: string;
  postal_code: string;
  sublocality_level_1: string;
  sublocality_level_2: string;
  sublocality_level_3: string;
}

interface RoomData {
  house_type: string;
  name: string;
  description: string;
  room: number;
  bed: number;
  bathroom: number;
  personnel: number;
  amenities: number[];
  facilities: number[];
  minimum_check_in_duration: number;
  maximum_check_in_duration: number;
  maximum_check_in_range: number;
  price_per_night: number;
  country: string;
  city: string;
  district: string;
  dong: string;
  address1: string;
  latitude: number;
  longitude: number;
  disable_days: string[];
  img_cover: File;
  house_images: File[];
}

interface Offering {
  id: number;
  content: string;
  available: boolean;
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit, DoCheck, AfterContentInit,
AfterContentChecked, AfterViewChecked {

//#region variable(변수)

  // 숙소 타입
  roomCategories = [
    { type: 'AP', content: '아파트' },
    { type: 'HO', content: '주택' },
    { type: 'OR', content: '원룸' }
  ];

  // 유저 선택 방타입
  selectedRoomType: string = 'AP';

  // 숙소 이름
  roomName: string = '';

  // 숙소 설명
  roomDescription: string = '';

  // 방 개수
  roomCounts: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  // 유저 선택 방개수
  selectedRoomCount: number = 1;

  // 침대 개수
  bedroomCount: number = 0;

  // 욕실 개수
  bathroomCount: number = 0;

  // 최대 숙박가능 인원
  roomCapacities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  // 유저 선택 숙박가능인원
  selectedRoomCapacity: number = 1;

  // 편의물품 { 구분 / 내용 / 사용가능 }
  amenities: Offering[] = [
    { id: 1, content: 'TV', available: false },
    { id: 2, content: '에어컨', available: false },
    { id: 3, content: '전자렌지', available: false },
    { id: 4, content: '커피포트', available: false },
    { id: 5, content: '컴퓨터', available: false },
    { id: 6, content: '공기청정기', available: false }
  ];

  // 편의시설 { 구분 / 내용 / 사용가능 }
  spaces: Offering[] = [
    { id: 1, content: '수영장', available: false },
    { id: 2, content: '엘리베이터', available: false },
    { id: 3, content: '세탁소', available: false },
    { id: 4, content: '노래방', available: false },
    { id: 5, content: '오락실', available: false },
    { id: 6, content: '온천', available: false }
  ];

  // 최소 체크인 기간
  minNightCount: number = 0;

  // 최대 체크인 기간
  maxNightCount: number = 0;

  // 체크인 가능 날수
  maxCheckinRange: number = 0;

  // 숙박 제한일
  maximumNightCount: number = 10;

  // 하루 요금
  price: number;

  // 주소 저장
  locationFields: LocationData =
  {
    country: '',
    city: '',
    district: '',
    dong: '',
    address1: '',
    premise: '',
    political: '',
    locality: '',
    administrative_area_level_1: '',
    postal_code: '',
    sublocality_level_3: '',
    sublocality_level_2: '',
    sublocality_level_1: ''
  };

  // 위도
  latitude = 37.49794199999999;
  // 경도
  longitude = 127.027621;
  // 확대정도
  zoom = 15;
  // 주소 완성
  formattedLocation = '';
  // 위치
  location: string;

  // 체크인 불가 날짜
  disableDays = '';

  // 현재 페이지의 상태
  pageStates: PageState[] = ['room', 'bedroom', 'bathroom',
    'location', 'amenities', 'spaces', 'picture', 'description',
    'accommodationName', 'maximumCheckInRange', 'minMaxReservationDate', 'price'];

  // 카운팅 될 페이지의 pagenumber
  stateCount = 0;
  // current page number
  currentState: PageState = this.pageStates[this.stateCount];

  // 유효정보 체크
  invalidData: boolean;

  // Local 임시저장 데이터
  roomLocalData: RoomData =
    {
      house_type: 'AP',
      name: 's',
      description: 's',
      room: 1,
      bed: 1,
      bathroom: 0,
      personnel: 1,
      amenities: [],
      facilities: [],
      minimum_check_in_duration: 0,
      maximum_check_in_duration: 0,
      maximum_check_in_range: 0,
      price_per_night: 0,
      country: '',
      city: '',
      district: '',
      dong: '',
      address1: '',
      latitude: 0,
      longitude: 0,
      disable_days: ['2017-04-15'],
      img_cover: null,
      house_images: []
    }
  ;

  // page에 따른 진척도 %표시
  progressbarPercentage = 10;

  // available-setting
  availableDates = ['1개월', '2개월', '3개월', '항상'];

  // 숙박일 validator
  reservationForm: FormGroup;

  // 사진 업로드
  apiUrl = 'https://himanmen.com/';
  form: FormGroup;
  loading = false;
  hideBtn = true;
  imageSrc = '';

  result; // file upload 수행 이후 서버로부터 수신한 데이터

  checked: boolean = false;

  componentForm = {
    premise: 'short_name',
    political: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name',
    sublocality_level_1: 'long_name',
    sublocality_level_2: 'long_name',
    sublocality_level_3: 'long_name'
  };

  // 전송할 폼데이터
  formData: FormData;

  imageList = [
    { id: this.getImageListNextId(), caption: '', image: null, available: false }
  ]

//#region 함수모음(function)

// public searchControl: FormControl;
  // @ViewChildren('dummy, search') public addressList: QueryList<ElementRef>;
constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private http: HttpClient) {
    this.form = this.fb.group({
      avatar: ['', Validators.required]
    });
  }

  ngOnChanges () {
    console.log('1: ngOnChange실행');
  }
  ngDoCheck () {
    // 변화를 감지 할시 실행됨 실행순서 1번
    // console.log('2: ngDoCheck실행');
  }
  ngAfterContentInit () {
    // console.log('3: ngAfterConetetnInit실행');
  }
  ngAfterContentChecked () {
    // 변화를 감지 할시 실행됨 실행순서 2번
    // console.log('4: ngAfterConentChecked실행');
  }
  ngAfterViewChecked () {
    // 변화를 감지 할시 실행됨 실행순서 3번
    // console.log('5: ngAfterViewChecked실행');
  }

  ngAfterViewInit () {
    // this.addressList.forEach(searchBox => {
    //   this.mapsAPILoader.load().then(() => {
    //     const autocomplete = new google.maps.places.Autocomplete(searchBox.nativeElement, {
    //       types: ['address']
    //     });
    //     autocomplete.addListener('place_changed', () => {
    //       this.ngZone.run(() => {
    //         // get the place result
    //         const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //         // verify result
    //         if (place.geometry === undefined || place.geometry === null) {
    //           return;
    //         }
    //       });
    //     });
    //   });
    // })
  }

  ngOnInit () {

  }

  chageRoomCount (roomCount) {
    this.selectedRoomCount = roomCount;
  }

  chageRoomCapacity (roomCapacity) {
    this.selectedRoomCapacity = roomCapacity;
  }

  chageRoomType (roomType) {
    this.selectedRoomType = roomType;
  }

  changeAmenity(event) {
    this.amenities = this.amenities.map(amenity => {
      return amenity.id === +event.value ? Object.assign({}, amenity, { available: !amenity.available }) : amenity;
    });
  }

  changeSpace(event) {
    this.spaces = this.spaces.map(space => {
      return space.id === +event.value ? Object.assign({}, space, { available: !space.available }) : space;
    });
  }

  getImageListId () {
    return this.imageList.map(image => image.id);
  }

  getImageListNextId() {
    return this.imageList ? Math.max.apply(null, this.getImageListId()) + 1 : 1;
  }

  onFileChange(files: FileList, imageId:string) {

    if (files && files.length > 0) {
      // For Preview
      const file = files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        // 파일이 성공적으로 등록되면 HTML에 있는 img src를 변경
        this.imageList = this.imageList.map(image => {
          return +imageId == image.id ?
            Object.assign({}, image, {caption: reader.result, available: true}) : image;
        });
      };

      // 커버이미지 등록
      this.roomLocalData.img_cover = files.item(0);

      // 하우스이미지 등록
      if (this.roomLocalData.house_images.length < 1) {
        this.roomLocalData.house_images = [files.item(0)];
      } else {
        this.roomLocalData.house_images = [...this.roomLocalData.house_images, files.item(0)];
      }

      // 하우스 이미지 formdata에 append
      for (var i = 0; i < this.roomLocalData.house_images.length; i++) {
        this.formData.append('house_images', this.roomLocalData.house_images[i]);
      }

      // 하우스이미지 4개 제한
      if (this.imageList.length < 4) {
        this.imageList = [...this.imageList, { id: this.getImageListNextId(),
        caption: '', image: null, available: false }];
      }
    }
  }

  sendingLocalData() {

    for (let key of Object.keys(this.roomLocalData)) {
      if (key === 'house_images') {
        continue;
      }
      this.formData.append(key, this.roomLocalData[key]);
    }
    console.log(this.roomLocalData);
    // const headers = new HttpHeaders()
    //   .set('Authorization', 'Token ccf9ec87c75370b9c702ad28ab20795a0622f364');

    // this.http.post('https://himanmen.com/house/', this.formData, { headers })
    //   .subscribe(response => {
    //     console.log(response);
    //   })
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

  uploadPhoto () {
    const upload = document.getElementById('upload-photo');
    upload.click();
  }

  // 주소 정보 초기화
  resetAddressData () {
    this.locationFields.address1 = '';
    this.locationFields.administrative_area_level_1 = '';
    this.locationFields.city = '';
    this.locationFields.country = '';
    this.locationFields.district = '';
    this.locationFields.dong = '';
    this.locationFields.locality = '';
    this.locationFields.political = '';
    this.locationFields.postal_code = '';
    this.locationFields.premise = '';
    this.locationFields.sublocality_level_1 = '';
    this.locationFields.sublocality_level_2 = '';
    this.locationFields.sublocality_level_3 = '';

    this.roomLocalData.city = '';
    this.roomLocalData.country = '';
    this.roomLocalData.district = '';
    this.roomLocalData.dong = '';
    this.roomLocalData.address1 = '';

  }

  // ccf9ec87c75370b9c702ad28ab20795a0622f364

  // google map GEO(위도,경도 및 요청정보) 얻기
  findLocation(location: string, address: any) {
    this.location = location;
    this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: 'AIzaSyCxXp7uUGDn2FCzjDg5j5Z-AQlCxcTLOdM'
      }
    })
    .subscribe(response => {
      console.dir(response);
      if (!response.results.length) {
        address.style.color = 'red';
        return this.formattedLocation = '올바른 주소를 입력 해 주세요.'
      }

      this.formattedLocation = '';
      // 입력하기전 필드셋 초기화
      this.resetAddressData();
      // 검색후 주소 결과 값 길이
      const getAddressLeng = response.results[0].address_components.length;
      for (let i = 0; i < getAddressLeng; i++) {
        // 주소 결과값 정보
        const addressData = response.results[0].address_components[i];

        // 주소 타입 분류
        const addressType = addressData.types[0];
        // 상세주소 길이 체크
        const detailAddressLeng = addressData.types.length;
        // 분류된 주소 타입 정보를 담을 배열
        const filteredAddressType: string[] = [];

        // 주소 타입 할당
        if (detailAddressLeng > 2) {
          filteredAddressType[i] = addressData.types[detailAddressLeng - 1];
        } else {
          filteredAddressType[i] = addressType;
        }

        // 정리된 포멧이 localAddressData에 저장
        if (this.componentForm[filteredAddressType[i]]) {
          const addressValue = addressData[this.componentForm[filteredAddressType[i]]];
          console.log(filteredAddressType[i], addressValue);

          this.locationFields[filteredAddressType[i]] = addressValue;
        }
      }

      this.formattedLocation = response.results[0].formatted_address;
      this.latitude = response.results[0].geometry.location.lat;
      this.longitude = response.results[0].geometry.location.lng;
    });
  }


  // 현재 페이지를 변경
  changePageState () {
    switch (this.currentState) {
      case 'room': this.currentState = this.pageStates[this.stateCount];
        // formdata 형성
        this.formData = new FormData();
        this.roomLocalData.room = this.selectedRoomCount;
        this.roomLocalData.personnel = this.selectedRoomCapacity;
        this.roomLocalData.house_type = this.selectedRoomType;
        break;

      case 'bedroom': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.bed = this.bedroomCount; break;

      case 'bathroom': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.bathroom = this.bathroomCount; break;

      case 'location': this.currentState = this.pageStates[this.stateCount];

        this.roomLocalData.country = this.locationFields.country;
        this.roomLocalData.city = this.locationFields.administrative_area_level_1;
        this.roomLocalData.district = this.locationFields.sublocality_level_1;
        this.roomLocalData.dong += this.locationFields.sublocality_level_2;
        this.roomLocalData.address1 += this.locationFields.sublocality_level_3;
        this.roomLocalData.address1 += this.locationFields.premise;
        this.roomLocalData.latitude = this.latitude;
        this.roomLocalData.longitude = this.longitude; break;

      case 'amenities': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.amenities =
          this.amenities.filter(amenity => amenity.available)
          .map(userAmenity => +userAmenity.id);

      case 'spaces': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.facilities =
          this.spaces.filter(space => space.available)
          .map(userSpace => +userSpace.id); break;

      case 'picture': this.currentState = this.pageStates[this.stateCount];
      break;

      case 'description': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.description = this.roomDescription; break;

      case 'accommodationName': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.name = this.roomName; break;

      case 'maximumCheckInRange': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.maximum_check_in_range = this.maxCheckinRange; break;

      case 'minMaxReservationDate': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.minimum_check_in_duration = this.minNightCount;
        this.roomLocalData.maximum_check_in_duration = this.maxNightCount;
        // this.roomLocalData.disable_days = this.disableDays; break;

      case 'price': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.price_per_night = this.price; break;

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

  //#endregion

}
