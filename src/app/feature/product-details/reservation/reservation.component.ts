import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import 'react-dates/initialize';

import { isInclusivelyAfterDay } from 'react-dates';
import { isInclusivelyBeforeDay } from 'react-dates';

import * as  START_DATE from 'react-dates/constants';
import * as  END_DATE from 'react-dates/constants';
import { isSameDay } from 'react-dates';
import * as moment from 'moment';
import { AuthService } from '../../../core/login/auth';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit{
  propsDRP: any;
  selectedDateRange: any;
  selectedDateRangeAdv: any;
  dateRangePickerProps: any;
  disabledDays: any;
  showdropdown: boolean;
  acount: number = 0;
  bcount: number = 0;
  result = 0;


  @Input() modal;
  @Input() pk;
  @Input() disableDay;
  @Output() reservationModal = new EventEmitter();


   constructor(public auth: AuthService) {
    this.date();

  }
  ngOnInit() {
    console.log('ttt', this.auth.getpk());
  }
  date() {
    const startTime = moment();
    const endTime = moment('2018-05-19').format();

    const duration = moment.duration(moment(endTime).diff(startTime));
    const days = duration.asDays();
    const test = Math.round(days) + 1;


    const datesList = [
      moment().add(test, 'days'),
    ];
    // 일별 블럭
    const isDayBlocked = day1 => datesList.some(day2 => isSameDay(day1, day2));

    // 현재 날 부터 3 개월 막기 and 현재일 뒷 날짜 막기

    const isOutsideRange = day =>
      isInclusivelyAfterDay(day, moment().add(3, 'months')) || !isInclusivelyAfterDay(day, moment().subtract(0, 'months'));
    this.propsDRP = {
      startDatePlaceholderText: '체크인',
      endDatePlaceholderText: '체크아웃',
      startDate : true,
      endDate: true,
      showClearDates: true,
      numberOfMonths: 2,
      daySize: 30,
      minimumNights: 3,
      maximumNights: 10,
      isOutsideRange: isOutsideRange,
      enableOutsideDays: true,
      isDayBlocked: isDayBlocked,
    };
    this.dateRangePickerProps = Object.assign({}, this.propsDRP);
  }
  giveDate() {
    const check_in_date = moment(this.selectedDateRange.start).format('YYYY-MM-DD');
    const check_out_date = moment(this.selectedDateRange.end).format('YYYY-MM-DD');
    console.log(check_in_date, check_out_date);
  }

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
    } else {
      this.result = this.acount + this.bcount;
      return this.result;
    }

  }
}
