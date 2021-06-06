import React, { useEffect} from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import styled from 'styled-components';
import ko from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
registerLocale('ko', ko)

const DateContainer = styled.div`
  display: flex;
`;

const SelectDate = styled(DatePicker)`
  height: 28px;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #e5e5e5;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: #e5e5e5;
  }
`;

const BetweenDate = styled.span`
  display: flex;
  align-items: center;
  border-radius: 10px;
  margin: 0px 5px;
  padding: 2px 12px;
  height: 28px;
  background-color: #e5e5e5;
  border: 1px solid #e5e5e5;
  font-size: 16px;
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
            maxDate={Date.now()}
            dateFormat="yyyy-MM-dd"
            placeholderText="클릭해주세요....."
            locale='ko'
          />
        </DateContainer>
      </>
    );
}

export default DatePick;