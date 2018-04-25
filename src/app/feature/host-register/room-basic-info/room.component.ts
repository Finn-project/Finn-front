import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';

import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import {
  subMonths,
  addMonths,
  addDays,
  addWeeks,
  subDays,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay
} from 'date-fns';
import { AuthService } from '../../../core/login/auth';
import { Router } from '@angular/router';


type CalendarPeriod = 'day' | 'week' | 'month';
export type PageState = 'room' | 'bedroom'
| 'bathroom' | 'location' | 'amenities' | 'spaces'
| 'picture' | 'description' | 'accommodationName'
| 'maximumCheckInRange' | 'minMaxReservationDate' | 'disableDate' | 'price' | 'register';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}


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
export class RoomComponent {

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
  11, 12, 13, 14, 15, 16];

  // 유저 선택 방개수
  selectedRoomCount: number = 1;

  // 침대 개수
  bedroomCount: number = 0;

  // 욕실 개수
  bathroomCount: number = 0;

  // 최대 숙박가능 인원
  roomCapacities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16];

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

  // 숙박 제한일
  maximumNightCount: number = 10;

  // 하루 요금
  price: number = 0;

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
    'accommodationName', 'maximumCheckInRange', 'minMaxReservationDate',
    'disableDate', 'price', 'register'];

  // 카운팅 될 페이지의 pagenumber
  stateCount = 0;
  // current page number
  currentState: PageState = this.pageStates[this.stateCount];

  // 유효정보 체크
  nextButtonState = {
    location_status: false,
    amenities_status: false,
    spaces_status: false,
    picture_status: false,
    description_status: false,
    accommodationName_status: false,
    minMaxReservationDate_status: false,
    disable_days_status: false,
    price_status: false
  }

  // Local 임시저장 데이터
  roomLocalData: RoomData =
    {
      house_type: 'AP',
      name: '',
      description: '',
      room: 0,
      bed: 0,
      bathroom: 0,
      personnel: 0,
      amenities: [],
      facilities: [],
      minimum_check_in_duration: 0,
      maximum_check_in_duration: 0,
      maximum_check_in_range: 30,
      price_per_night: 0,
      country: '',
      city: '',
      district: '',
      dong: '',
      address1: '',
      latitude: 0,
      longitude: 0,
      disable_days: [],
      img_cover: null,
      house_images: []
    }
  ;

  // page에 따른 진척도 %표시
  progressbarPercentage = 0;

  // available-setting
  availableDates = ['1개월', '2개월', '3개월'];

  // 숙박일 validator
  reservationForm: FormGroup;

  // 사진 업로드
  apiUrl = 'https://himanmen.com/';
  form: FormGroup;
  loading = false;
  hideBtn = true;
  imageSrc = '';

  result; // file upload 수행 이후 서버로부터 수신한 데이터

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

  // 사진 정보 임시저장공간
  imageList = [
    { id: this.getImageListNextId(), caption: '', image: null, available: false }
  ];

  // 달력 관련 변수
  view: CalendarPeriod = 'month';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  clickedDate: Date;

  minDate: Date = subMonths(new Date(), 0);

  maxDate: Date = addMonths(new Date(), 1);

  prevBtnDisabled: boolean = false;

  nextBtnDisabled: boolean = false;

  currentYear: number = 0;

  currentMonth: string = '';

  currentDate: number = 0;

  convertedMonth: string = '';

  convertedDate: string = '';

  monthNames = ['01', '02', '03', '04', '05', '06', '07',
    '08', '09', '10', '11', '12'];

  clickedToday: string = '';

  yearMonth: string = '';

  disableDate: string[] = [];

  dateCheck: boolean = false;

  checkDisable: string = '';

  userKey:string = '';

//#region 함수모음(function)


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private fb: FormBuilder,
    public auth: AuthService,
    public router: Router,
    private http: HttpClient) {
    this.form = this.fb.group({
      avatar: ['', Validators.required]
    });
    this.dateOrViewChanged();
  }
  // 방 개수 변경시
  chageRoomCount (roomCount) {
    this.selectedRoomCount = roomCount;
  }

  // 인원 변경
  chageRoomCapacity (roomCapacity) {
    this.selectedRoomCapacity = roomCapacity;
  }

  // 방 유형변경
  chageRoomType (roomType) {
    this.selectedRoomType = roomType;
  }

  // 최대 체크인 가능기간 설정
  chageAvailableDate (availableDate) {
    switch (availableDate) {
      case '1개월': this.roomLocalData.maximum_check_in_range = 30;
            this.maxDate = addMonths(new Date(), 1); break;
      case '2개월' : this.roomLocalData.maximum_check_in_range = 60;
            this.maxDate = addMonths(new Date(), 2); break;
      case '3개월' : this.roomLocalData.maximum_check_in_range = 90;
            this.maxDate = addMonths(new Date(), 3);break;
      default : this.roomLocalData.maximum_check_in_range = 30; break;
    }
  }

  // 편의물품 체크
  changeAmenity(event) {

    this.amenities = this.amenities.map(amenity => {
      return amenity.id === +event.value ? Object.assign({}, amenity, { available: !amenity.available }) : amenity;
    });

    this.roomLocalData.amenities =
    this.amenities.filter(amenity => amenity.available)
    .map(userAmenity => +userAmenity.id);

    if (this.roomLocalData.amenities.length) {
      this.switchNextButtonValid();
    } else {
      this.switchNextButtonInvalid();
    }
  }

  // 편의시설 체크
  changeSpace(event) {
    this.spaces = this.spaces.map(space => {
      return space.id === +event.value ? Object.assign({}, space, { available: !space.available }) : space;
    });

    this.roomLocalData.facilities =
      this.spaces.filter(space => space.available)
        .map(userSpace => +userSpace.id);

    if (this.roomLocalData.facilities.length) {
      this.switchNextButtonValid();
    } else {
      this.switchNextButtonInvalid();
    }
  }

  // 사진 번호 얻어오기
  getImageListId () {
    return this.imageList.map(image => image.id);
  }

  // 사진 다음 번호 얻기
  getImageListNextId() {
    return this.imageList ? Math.max.apply(null, this.getImageListId()) + 1 : 1;
  }

  // 사진 삭제
  removePhoto (id: number) {

    this.imageList = this.imageList.map(image => {
      return id === image.id ?
        Object.assign({}, image, { image:"" ,caption: null, available: false }) : image;
    });

    if (this.imageList.length > 1) {
      this.imageList = this.imageList.filter(image => {
        return id !== image.id;
      })
    }
  }

  // 사진 등록
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

      // 하우스이미지 4개 제한
      if (this.imageList.length < 4) {
        this.imageList = [...this.imageList, { id: this.getImageListNextId(),
        caption: '', image: null, available: false }];
      }

      // 사진 페이지 상태
      if (this.roomLocalData.house_images.length) {
        this.nextButtonState.picture_status = true;
        this.switchNextButtonValid();
      } else {
        this.nextButtonState.picture_status = false;
        this.switchNextButtonValid();
      }
    }
  }

  get avatar() {
    return this.form.get('avatar');
  }

  // 최소숙박수를 입력받아 number로 변경해서 저장
  changeMinNightCount(event: string) {
    const checkNum = /[0-9]+/g;
    const formattedNum = event.match(checkNum).join('');
    const parseNumber = parseInt(formattedNum, 10);
    const absNum = Math.abs(parseNumber);
    this.minNightCount = absNum;
    this.checkNextButtonState();
  }

  // 최대숙박수를 입력받아 number로 변경해서 저장
  changeMaxNightCount(event: string) {
    const checkNum = /[0-9]+/g;
    const formattedNum = event.match(checkNum).join('');
    const parseNumber = parseInt(formattedNum, 10);
    const absNum = Math.abs(parseNumber);
    this.maxNightCount = absNum;
    this.checkNextButtonState();
  }

  // 요금을 입력받아 number로 변경해서 저장
  changePrice (event: string) {
    const checkNum = /[0-9]+/g;
    const formattedNum = event.match(checkNum).join('');
    const parseNumber = parseInt(formattedNum, 10);
    const absNum = Math.abs(parseNumber);
    this.price = absNum;
    this.checkNextButtonState();
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
      if (!response.results.length) {
        this.nextButtonState.location_status = false;
        this.switchNextButtonInvalid();
        address.style.color = 'red';
        return this.formattedLocation = '올바른 주소를 입력 해 주세요.'
      }

      address.style.color = 'black';
      // 주소 입력 확인 여부

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
          this.locationFields[filteredAddressType[i]] = addressValue;
        }
      }

      // 정돈된 주소값 , 위도, 경도
      this.formattedLocation = response.results[0].formatted_address;
      this.latitude = response.results[0].geometry.location.lat;
      this.longitude = response.results[0].geometry.location.lng;

      // 유효정보 입력후 location page 상태변경
      this.nextButtonState.location_status = true;

      this.switchNextButtonValid();
    });
  }

  checkNextButtonState () {
    // 편의물품 체크
    if (this.roomLocalData.amenities.length) {
      this.nextButtonState.amenities_status = true;
    } else {
      this.nextButtonState.amenities_status = false;
    }

    // 편의시설 체크
    if (this.roomLocalData.facilities.length) {
      this.nextButtonState.spaces_status = true;
    } else {
      this.nextButtonState.spaces_status = false;
    }

    // 숙소이름 유효성검사
    if (this.roomName.length < 1 || this.roomName.length > 11) {
      this.nextButtonState.accommodationName_status = false;
    } else {
      this.nextButtonState.accommodationName_status = true;
      this.switchNextButtonValid();
    }

    // 숙소설명 유효성검사
    if (this.roomDescription.length < 1 || this.roomDescription.length > 201) {
      this.nextButtonState.description_status = false;
    } else {
      this.nextButtonState.description_status = true;
      this.switchNextButtonValid();
    }


     // 최소 최대 기간 유효성검사
    if (this.currentState === 'minMaxReservationDate') {
      if (this.minNightCount <= 0 || this.maxNightCount < this.minNightCount
        || this.maxNightCount > 10 || this.maxNightCount === this.minNightCount) {
        this.nextButtonState.minMaxReservationDate_status = false;
        this.switchNextButtonInvalid();
      } else {
        this.nextButtonState.minMaxReservationDate_status = true;
        this.switchNextButtonValid();
      }
    }

    // disable days 유효성 검사
    if (this.currentState === 'disableDate') {

      if(this.disableDate.length === 0) {
        this.nextButtonState.disable_days_status = false;
        this.switchNextButtonInvalid();
      } else {
        this.nextButtonState.disable_days_status = true;
        this.switchNextButtonValid();
      }

    }


    // 하루숙박 비용 유효성검사

    if (this.currentState === 'price') {
      if (this.price < 10670 ||
        this.price > 10669995) {
        this.nextButtonState.price_status = false;
        this.switchNextButtonInvalid();

      } else {
        this.nextButtonState.price_status = true;
        this.switchNextButtonValid();
      }
    }
  }

  getClickedDate(event) {

    if (this.clickedDate.getMonth() + 1 < 10) {
      this.convertedMonth = '0' + (this.clickedDate.getMonth() + 1);
    } else {
      this.convertedMonth = '' + (this.clickedDate.getMonth() + 1);
    }

    if (this.clickedDate.getDate() < 10) {
      this.convertedDate = '0' + this.clickedDate.getDate();
    } else {
      this.convertedDate = '' + this.clickedDate.getDate();
    }

    this.clickedToday = this.clickedDate.getFullYear() + '-' + this.convertedMonth + '-' + this.convertedDate;

    if (!event.classList.contains('cal-cell-row') ||
      !event.classList.contains('cal-future')) {
      this.dateCheck = this.disableDate.includes(this.clickedToday);
      this.disableDate = this.disableDate.filter(date => {
        return date !== this.clickedToday;
      });

      event.classList.remove('clicked');

      if (!this.dateCheck) {
        this.disableDate = [...this.disableDate, this.clickedToday];
        event.classList.add('clicked');
      }
    }
    this.checkNextButtonState();
  }

  ngDoCheck() {
    this.currentMonth = this.monthNames[this.viewDate.getMonth()];
    this.currentYear = this.viewDate.getFullYear();
    this.yearMonth = this.currentYear + '년' + this.currentMonth + ' 월';
  }

  ngOnInit() {
    this.dateOrViewChanged();
    this.userKey = this.auth.getToken();
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    this.prevBtnDisabled = !this.dateIsValid(
      endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
    );
    this.nextBtnDisabled = !this.dateIsValid(
      startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
      this.checkDisable = day.date.getFullYear() + '-' + (day.date.getMonth() + 1) + '-' + day.date.getDate();

      for (let i = 0; i < this.disableDate.length; i++) {
        if (this.disableDate[i] === this.checkDisable) {
          day.cssClass = 'clicked';
        }
      }
    });
  }

  // 현재 페이지를 변경하며 상태에따라 로컬데이터에 정보입력
  changePageState () {
    switch (this.currentState) {
      case 'room': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.room = this.selectedRoomCount;
        this.roomLocalData.personnel = this.selectedRoomCapacity;
        this.roomLocalData.house_type = this.selectedRoomType;
        break;

      case 'bedroom': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.bed = this.bedroomCount;
        break;

      case 'bathroom': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.bathroom = this.bathroomCount;
        if (!this.nextButtonState.location_status) {
            this.switchNextButtonInvalid();
        } break;

      case 'location': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.country = this.locationFields.country;
        this.roomLocalData.city = this.locationFields.administrative_area_level_1;
        this.roomLocalData.district = this.locationFields.sublocality_level_1;
        this.roomLocalData.dong += this.locationFields.sublocality_level_2;
        this.roomLocalData.address1 += this.locationFields.sublocality_level_3;
        this.roomLocalData.address1 += this.locationFields.premise;
        this.roomLocalData.latitude = this.latitude;
        this.roomLocalData.longitude = this.longitude;
        if (!this.nextButtonState.amenities_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'amenities': this.currentState = this.pageStates[this.stateCount];
        this.checkNextButtonState();
        if (!this.nextButtonState.spaces_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'spaces': this.currentState = this.pageStates[this.stateCount];
        this.checkNextButtonState();
        if (!this.nextButtonState.picture_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'picture': this.currentState = this.pageStates[this.stateCount];
        if (!this.nextButtonState.description_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'description': this.currentState = this.pageStates[this.stateCount];
      this.roomLocalData.description = this.roomDescription;
        this.checkNextButtonState();
        if (!this.nextButtonState.accommodationName_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'accommodationName': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.name = this.roomName;
        this.checkNextButtonState();
        break;

      case 'maximumCheckInRange': this.currentState = this.pageStates[this.stateCount];
        if (!this.nextButtonState.minMaxReservationDate_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'minMaxReservationDate': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.minimum_check_in_duration = this.minNightCount;
        this.roomLocalData.maximum_check_in_duration = this.maxNightCount;
        this.checkNextButtonState();
        if (!this.nextButtonState.price_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'disableDate': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.disable_days = this.disableDate;
        this.checkNextButtonState();
        if (!this.nextButtonState.price_status) {
          this.switchNextButtonInvalid();
        } break;

      case 'price': this.currentState = this.pageStates[this.stateCount];
        this.roomLocalData.price_per_night = this.price;
        this.checkNextButtonState();
        break;

      case 'register': this.currentState = this.pageStates[this.stateCount];
        break;

      default: this.currentState = this.pageStates[this.stateCount]; break;
    }
  }

  // 완료버튼
  sendingLocalData() {

    // formdata 형성
    this.formData = new FormData();

    // 사진 append
    for (var i = 0; i < this.roomLocalData.house_images.length; i++) {
      this.formData.append('house_images', this.roomLocalData.house_images[i]);
    }

    // 편의물품 append
    for (var j = 0; j < this.roomLocalData.amenities.length; j++) {
      this.formData.append('amenities', this.roomLocalData.amenities[j].toString());
    }

    // 편의시설 append
    for (var k = 0; k < this.roomLocalData.facilities.length; k++) {
      this.formData.append('facilities', this.roomLocalData.facilities[k].toString());
    }

    // 예약불가날짜 append
    for (var l = 0; l < this.roomLocalData.disable_days.length; l++) {
      this.formData.append('disable_days', this.roomLocalData.disable_days[l]);
    }

    for (let key of Object.keys(this.roomLocalData)) {

      if (key === 'house_images' || key === 'amenities' || key === 'facilities' || key === 'disable_days') {
        continue
      }
      this.formData.append(key, this.roomLocalData[key]);
      // console.log(key, ':', typeof this.roomLocalData[key], this.roomLocalData[key]);
    }


    const headers = new HttpHeaders()
      .set('Authorization', `Token ${this.userKey}`);

    this.http.post('https://dlighter.com/house/', this.formData, { headers })
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['']);
      })


  }

  modifyLocalData () {
    this.currentState = 'room';
    this.stateCount = 0;
  }

  // 버튼 상태 함수
  switchNextButtonInvalid() {
    const nextButton = document.getElementById('next-button');
    nextButton.classList.add('invalid');
  }

  switchNextButtonValid() {
    const nextButton = document.getElementById('next-button');
    nextButton.classList.remove('invalid');
  }

  // 뒤로 버튼
  backPageState () {
    if (this.stateCount > 0) {
      this.stateCount--;
      const progressBar = document.getElementById('progressbar');
      if (this.progressbarPercentage > 0) {
        this.progressbarPercentage -= 8;
        if (this.progressbarPercentage < 0) {
          this.progressbarPercentage = 0;
        }
        progressBar.style.width = this.progressbarPercentage + '%';
      }
      this.changePageState();
      this.switchNextButtonValid();
    }
  }

  // 다음 버튼
  nextPageState () {
    if (this.stateCount < 13) {
      this.stateCount++;
      const progressBar = document.getElementById('progressbar');
      if (this.progressbarPercentage < 100) {
        this.progressbarPercentage += 8;

        if(this.progressbarPercentage > 100) {
          this.progressbarPercentage = 100;
        }
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
    this.checkNextButtonState();
  }

  // 최소 숙박일수 감소
  decreaseMinNight() {
    if (this.minNightCount > 0) {
      this.minNightCount--;
      this.checkNextButtonState();
    }
  }

  // 최대 숙박일수 증가
  increaseMaxNight() {
    this.maxNightCount++;
    this.checkNextButtonState();
  }

  // 최대 숙박일수 감소
  decreaseMaxNight() {
    if (this.maxNightCount > 0) {
      this.maxNightCount--;
      this.checkNextButtonState();
    }
  }

  // aside on/off 함수
  asideState():boolean {
    if (this.currentState === 'picture') {
      return false;
    } else if (this.currentState === 'disableDate') {
      return false;
    } else if (this.currentState === 'register') {
      return false;
    } else {
      return true;
    }
  }

  //#endregion

}
