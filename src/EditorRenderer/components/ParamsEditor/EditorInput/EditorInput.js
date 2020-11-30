import React from 'react';
import classes from './EditorInput.module.css';
const EditorInput=(props)=>{
    const label=props.name.split(/(?=[A-Z])/).join(' ');
    switch (props.input.type) {
        case 'select':
            const opts=props.input.options.map(option=>(
            <option key={option} value={option}>{option}</option>
            ));
            return (<div className={classes.InputContainer}><label className={classes.Label}>{label}</label><select className={classes.Input+' '+classes.Select} name={props.name} defaultValue={props.input.value}>
                {opts}
            </select></div>);
        case 'textarea':
            return(<div className={classes.InputContainer}><label className={classes.Label}>{label}</label> <textarea className={classes.Input} name={props.name} defaultValue={props.input.value} /></div>);

        default:
            return(<div className={classes.InputContainer}><label className={classes.Label}>{label}</label> <input className={classes.Input} name={props.name} defaultValue={props.input.value} /></div>);
    }
}

export default EditorInput;