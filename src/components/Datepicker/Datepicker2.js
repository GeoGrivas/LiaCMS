import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import axios from 'axios';
import Litepicker from 'litepicker';
import React, { useEffect, useState } from 'react';
import Spinner from '../UI/Spinner/Spinner';

const Datepicker2 = (props) => {

    const [state, setState] = useState({
        result: 'Please select your dates.',
        loading:true
    });
    let picker = null;
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const onSelect = (startDate, endDate) => {
        setState({result:'Getting prices...',loading:true});
        axios.get(`https://www.eostravel.com/listing/GetPrice?PropertyId=${props.block.params.propertyId.value}&EndDate=${("0" + endDate.getDate()).slice(-2) + "-" + ("0" + (endDate.getMonth() + 1)).slice(-2) + "-" +
            endDate.getFullYear()}&StartDate=${("0" + startDate.getDate()).slice(-2) + "-" + ("0" + (startDate.getMonth() + 1)).slice(-2) + "-" +
            startDate.getFullYear()}`).then(resp => {
                const text = startDate.toLocaleDateString('en-US', options) + ' to ' + endDate.toLocaleDateString('en-US', options) + ' Price : ' + resp.data.split('|')[0] + ' Euros';
                setState({ result: text,loading:false });

            })
    };
    useEffect(() => {
        if (picker === null) {
            axios.get(`https://www.eostravel.com/listing/availability2?propertyid=${props.block.params.propertyId.value}`).then(resp => {
                picker = new Litepicker({
                    element: document.getElementById(props.block.id),
                    elementEnd: document.getElementById(props.block.id + '2'),
                    inlineMode: true,
                    singleMode: false,
                    numberOfMonths: 2,
                    showTooltip: false,
                    numberOfColumns: 2,
                    minDate: new Date(),
                    maxDate: new Date(resp.data.lastAvailableDate),
                    lockDays: resp.data.unavailablePeriods,
                    onSelect: onSelect,minDays:3,
                    maxDays:15
                });
                setState({...state,loading:false});
                picker.gotoDate(new Date(resp.data.firstAvailableDate));
            }).catch(err => {
                return;
            });
        }
    }, []);
    return (
        <div style={{}}>
            <input style={{ display: 'none' }} defaultValue={''} id={props.block.id} />
            <input style={{ display: 'none' }} defaultValue={''} id={props.block.id + '2'} />
            <p style={{textDecoration:'underline'}}>
                <b>{state.result}</b>
            </p>
        </div>
    );
}

export default Datepicker2;