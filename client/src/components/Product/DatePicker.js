import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import styled from 'styled-components';
import ko from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css" ;
registerLocale('ko', ko)

const DateContainer = styled.div`
  display: flex;
`;

const SelectDate = styled(DatePicker)`
  height: 22px;
  padding: 6px 12px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #e5e5e5;
  outline: none;
  cursor: pointer;
`;

const BetweenDate = styled.span`
  display: table;
  padding: 0px 12px;
  height: 22px;
  background-color: #e5e5e5;
  border: 1px solid #e5e5e5;
  font-size: 14px;
  cursor: pointer;
`;

function DatePick({ date, setDate, endDate, setEndDate }) {
    return (
      <>
        <DateContainer>
          <SelectDate
            selected={date}
            onChange={(date) => setDate(date)}
            maxDate={endDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="클릭해주세요....."
            locale='ko'
          />
          <BetweenDate>~</BetweenDate>
          <SelectDate
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={date}
            dateFormat="yyyy-MM-dd"
            placeholderText="클릭해주세요....."
            locale='ko'
          />
        </DateContainer>
      </>
    );
}

export default DatePick;