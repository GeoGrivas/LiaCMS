import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Datepicker = (props) => {

    const [state, setState] = useState({
        dates: [
            {
                startDate: null,
                endDate: null,
                key: 'selection'
            }
        ],
        disabledDays: [],
        numberOfMonths:parseInt(props.block.params.numberOfMonths.value),
        minDate: props.block.params.minDate.value!==''?new Date(props.block.params.minDate.value):undefined,
        maxDate: props.block.params.maxDate.value!==''?new Date(props.block.params.maxDate.value):undefined,
        ogMinDate: props.block.params.minDate.value!==''?new Date(props.block.params.minDate.value):undefined,
        ogMaxDate: props.block.params.maxDate.value!==''?new Date(props.block.params.maxDate.value):undefined
    });

    const onSelect = (selection) => {
        let minDate = state.minDate;
        let maxDate = state.maxDate;

        if (selection.startDate === selection.endDate) {
            if (props.block.params.maxRange.value > 0) {
                const daysBefore = new Date(selection.startDate);
                daysBefore.setDate(daysBefore.getDate() -  parseInt(props.block.params.maxRange.value));

                if (!state.minDate || state.minDate < daysBefore) {
                    minDate = daysBefore;
                    console.log('setting min date!');
                }
                const daysAfter = new Date(selection.startDate);
                daysAfter.setDate(daysAfter.getDate() + parseInt(props.block.params.maxRange.value));
                if (!state.maxDate || state.maxDate < daysAfter) {
                    maxDate = daysAfter;
                    console.log('setting max date!',daysAfter);
                }
            }
        } else {
            minDate = state.ogMinDate;
            maxDate = state.ogMaxDate;
        }
        setState({numberOfMonths:state.numberOfMonths,ogMaxDate:state.ogMaxDate,ogMinDate:state.ogMinDate, dates: [selection], disabledDays: [], minDate: minDate, maxDate: maxDate });
    }
    useEffect(() => {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var numberOfMonthsThatFit=parseInt(width/350);
        if(numberOfMonthsThatFit<state.numberOfMonths)
        {
            setState({...state,numberOfMonths:numberOfMonthsThatFit})
        }
    }, []);
    return (
        <DateRange
            editableDateInputs={false}
            onChange={item => { onSelect(item.selection); }}
            moveRangeOnFirstSelection={false}
            minDate={state.minDate}
            maxDate={state.maxDate}
            direction={'horizontal'}
            disabledDates={state.disabledDays}
            ranges={state.dates}
            months={state.numberOfMonths}
        />);
}

export default Datepicker;