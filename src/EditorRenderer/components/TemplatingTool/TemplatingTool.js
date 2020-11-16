import React, { useEffect, useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import axios from 'axios';
import classes from './TemplatingTool.module.css';
import { removeBordersFromComponents } from '../../Logic/EditingLogic';
const TemplatingTool = (props) => {
    const [information, setInformation] = useState();
    const [url, setUrl] = useState('');
    const onFetchClicked = () => {
        //if (url !== '' && url.includes('http')) {
        //    axios.get(url).then(resp => {
        //        setInformation(JSON.parse(resp.data));
        //    });
        //} else {
        setInformation(JSON.parse(url));
        //}
        document.querySelector('#sidebar').style.width = '40%';
        document.querySelector('#main').style.width = '60%';
        document.querySelector('#main').style.marginLeft = '40%';
    };
    const [mappings, setMappings] = useState([]);
    const [currentMapping, setCurrentMapping] = useState({ component: '', info: '' });
    const addBordersToElementOnButtonHover = (id) => {
        var item = document.getElementById(id);
        item.childNodes[item.childNodes.length - 1].classList.add('border');
    }
    const digDeep = (object, initKey) => {
        const keys = Object.keys(object);
        const keyBuild = initKey;
        var result = keys.map(key => {
            var location = [...keyBuild, key].join(' ');
            if (typeof object[key] === 'object') {
                return <div className={classes.step}>
                    <Button  onClick={()=>{setCurrentMapping({...currentMapping,info:[...keyBuild, key]})}}>{location}</Button>
                    {digDeep(object[key], [...keyBuild, key])}
                </div>
            } else {
                return <div>
                    <div>{location}</div>
                    <Button  onClick={()=>{setCurrentMapping({...currentMapping,info:[...keyBuild, key]})}}>{object[key]}</Button>
                </div>
            }
        });
        return result;
    }
    const components = props.components;
    const digDeepComponents = (components, initKey) => {
        const keyBuild = initKey;
        let i = -1;
        var result = components.map(component => {
            i++;
            if (component.children && Array.isArray(component.children) && component.children.length > 0) {
                return digDeepComponents(component.children, [...keyBuild, i]);
            } else {
                var location = [...keyBuild, i].join(' ');
                var params = null;
                if (component.params) {
                    console.log(component.params);
                    var paramkeys = Object.keys(component.params);
                    params= paramkeys.map(paramKey => <div onClick={()=>{setCurrentMapping({...currentMapping,component:[...keyBuild,i,paramKey]})}}>{paramKey}</div>);
                }
                return <div>
                    <span>{location}</span>
                    <div onMouseOut={() => { removeBordersFromComponents(); }} onMouseOver={() => { addBordersToElementOnButtonHover(component.id) }}>
                        {component.id}
                        {params}
                    </div>
                </div>
            }

        });
        return result;
    }

    if (information) {
        return (
            <div className='row'>
                <div className='col-sm-6' style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                    <React.Fragment>
                        {digDeepComponents(components, [])}
                    </React.Fragment>
                </div>
                <div className='col-sm-6' style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                    <React.Fragment>
                        {digDeep(information, [])}
                    </React.Fragment>
                </div>
                <div className='col-sm-12'>
                    <span>{currentMapping.component.join(' ')}</span> - <span>{currentMapping.info.join(' ')}</span>
                </div>
            </div>);
    } else {
        return (

            <div>
                <input value={url} onChange={(e) => { const value = e.target.value; setUrl(value); }} />
                <Button onClick={onFetchClicked}>Fetch data</Button>
            </div>);
    }
};

export default TemplatingTool;