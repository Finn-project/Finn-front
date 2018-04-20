import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import 'react-dates/initialize';

import { isInclusivelyAfterDay } from 'react-dates';
import { isInclusivelyBeforeDay } from 'react-dates';

import * as  START_DATE from 'react-dates/constants';
import * as  END_DATE from 'react-dates/constants';
import { isSameDay } from 'react-dates';
import * as moment from 'moment';
import { AuthService } from '../../../core/login/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  propsDRP: any;
  selectedDateRange: any;
  selectedDateRangeAdv: any;
  dateRangePickerProps: any;

  disabledDays: any;
  showdropdown: boolean;
  acount: number = 0;
  bcount: number = 0;
  result = 0;
  data : any;
  days_value : number;

  res: any;
  local: any;

  // set test(data) {
  //   this.auth.test = data;
  // }

  house_value = this.auth.gethouse_value();
  price = this.house_value.price_per_night;
  @Input() modal;
  @Output() reservationModal = new EventEmitter();

   constructor(public auth: AuthService,
  private router: Router) { this.date();}


  ngOnInit() {
    console.log('value', this.house_value);
    console.log('maxmun', this.house_value.maximum_check_in_range);
    console.log('disable', this.house_value.disable_days);
    console.log('reserve', this.house_value.reserve_days);
  }


  date() {
    let array = [];
    let data = this.house_value.disable_days;
    const reserve = this.house_value.reserve_days;

    if (reserve == null) {
      return false;
    }
    data = data.concat(...reserve);
    for (let i = 0; i < data.length; i++) {
      const startTime = moment();
      const endTime = moment(data[i]).format('YYYY MM DD');
      const duration = moment.duration(moment(endTime).diff(startTime));
      const days = duration.asDays();
      const days_value = Math.round(days) + 1;
      array = array.concat(days_value);

    }
    console.log('array_check', array);
    let datesList = [ ];

    for (let i = 0; i < array.length; i++) {
      datesList = datesList.concat(moment().add(array[i], 'days'));
    }

    // 일별 블럭
    const isDayBlocked = day1 => datesList.some(day2 => isSameDay(day1, day2));

    const isOutsideRange = day =>
      isInclusivelyAfterDay(day, moment().add(this.house_value.maximum_check_in_range, 'days'))
      || !isInclusivelyAfterDay(day, moment().subtract(0, 'months'));
    this.propsDRP = {
      startDatePlaceholderText: '체크인',
      endDatePlaceholderText: '체크아웃',
      startDate: true,
      endDate: true,
      showClearDates: true,
      numberOfMonths: 2,
      daySize: 30,
      minimumNights: this.house_value.minimum_check_in_duration,
      isOutsideRange: isOutsideRange,
      enableOutsideDays: false,
      isDayBlocked: isDayBlocked,
    };
    this.dateRangePickerProps = Object.assign({}, this.propsDRP);
  }
  giveDate() {
    const check_in_date = moment(this.selectedDateRange.start).format('YYYY-MM-DD');
    const check_out_date = moment(this.selectedDateRange.end).format('YYYY-MM-DD');
    console.log(check_in_date, check_out_date);

    const duration = moment.duration(moment(this.selectedDateRange.end).diff(this.selectedDateRange.start));
    const days = duration.asDays();
    this.days_value = Math.round(days) + 1;

    this.data = { check_in_date: check_in_date ,
       check_out_date: check_out_date,
      house: this.house_value.pk,
       guest_num : this.totalcount(),
      name : this.house_value.name ,
      description: this.house_value.description,
      img: this.house_value.img_cover_thumbnail,
      price: this.house_value.price_per_night,
      date : this.days_value
     };
    this.setData();
    this.router.navigate(['/payment']);
    // this.test = this.data;

  }

    setData() {
      localStorage.setItem('house_data', JSON.stringify(this.data));
    }


// drop down menu function
  dropdown() {
    this.showdropdown = !this.showdropdown;
  }

  aplus() {
    this.acount ++;
  }
  aminus() {
    this.acount--;
  }
  bplus() {
    this.bcount++;
  }
  bminus() {
    this.bcount--;
  }

  totalcount() {
    if (this.acount + this.bcount === 0) {
      return 0;
    }  else {
      this.result = this.acount + this.bcount;
      return this.result;
    }
  }
}



  // const startTime = moment();
    // const endTime = moment('2018-05-20').format();

    // const duration = moment.duration(moment(endTime).diff(startTime));
    // const days = duration.asDays();
    // const test = Math.round(days) + 1;


    // const datesList = [
    //   moment().add(test, 'days'),
    // ];
    // // 일별 블럭
    // const isDayBlocked = day1 => datesList.some(day2 => isSameDay(day1, day2));

    // 현재 날 부터 3 개월 막기 and 현재일 뒷 날짜 막기

    // const isOutsideRange = day =>
    //   isInclusivelyAfterDay(day, moment().add(3, 'months')) || !isInclusivelyAfterDay(day, moment().subtract(0, 'months'));
