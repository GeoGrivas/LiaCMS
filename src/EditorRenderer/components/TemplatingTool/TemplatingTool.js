import React, { useEffect, useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import axios from 'axios';
import classes from './TemplatingTool.module.css';
import { removeBordersFromComponents, mapComponents } from '../../Logic/EditingLogic';
const TemplatingTool = (props) => {
    const [information, setInformation] = useState();
    const [url, setUrl] = useState('');
    const onFetchClicked = () => {
        if (url !== '') {
            if (url.startsWith('http')) {
                axios.get(url).then(resp => {
                    setInformation(JSON.parse(resp.data));
                    document.querySelector('#sidebar').style.width = '40%';
                    document.querySelector('#main').style.width = '60%';
                    document.querySelector('#main').style.marginLeft = '40%';
                }).catch(err => {
                    console.log(err);
                }
                );
            } else {
                setInformation(JSON.parse(url));
                document.querySelector('#sidebar').style.width = '40%';
                document.querySelector('#main').style.width = '60%';
                document.querySelector('#main').style.marginLeft = '40%';
            }
        }
    };
    const [mappings, setMappings] = useState([]);
    const [currentMapping, setCurrentMapping] = useState({ component: [], info: [] });
    const addBordersToElementOnButtonHover = (id) => {
        var item = document.getElementById(id);
        item.childNodes[item.childNodes.length - 1].classList.add('border');
    }
    const onMappingsAdd = () => {
        setMappings([...mappings, currentMapping]);
        setCurrentMapping({ component: [], info: [] });
    }
    const onMappingDelete = (idx) => {
        let tmpArray = [...mappings];
        tmpArray.splice(idx, 1);
        setMappings(tmpArray);
    }
    const digDeep = (object, initKey) => {
        const keys = Object.keys(object);
        const keyBuild = initKey;
        var result = keys.map((key,idx) => {
            var location = [...keyBuild, key].join(' ');
            if (typeof object[key] === 'object') {
                return <div key={location} className={classes.step}>
                    <Button onClick={() => { setCurrentMapping({ ...currentMapping, info: [...keyBuild, key] }) }}>{location}</Button>
                    {digDeep(object[key], [...keyBuild, key])}
                </div>
            } else {
                return <div key={location+idx}>
                    <div>{location}</div>
                    <Button onClick={() => { setCurrentMapping({ ...currentMapping, info: [...keyBuild, key] }) }}>{object[key]}</Button>
                </div>
            }
        });
        return result;
    }
    const onMapComponentsClick = () => {
        const result = mapComponents(components, mappings, information);
        props.setComponents(result);
    }
    const components = props.components;
    const digDeepComponents = (components) => {

        var result = components.map((component,idx1) => {

            if (component.children && Array.isArray(component.children) && component.children.length > 0) {
                return digDeepComponents(component.children);
            } else {
                var params = null;
                if (component.params) {
                    var paramkeys = Object.keys(component.params);
                    params = paramkeys.map((paramKey,idx2) => <div key={idx2+'k'} onClick={() => { setCurrentMapping({ ...currentMapping, component: [component.id, paramKey] }) }}>{paramKey}</div>);
                }
                return <div key={idx1+'l'}>
                    <div  onMouseOut={() => { removeBordersFromComponents(); }} onMouseOver={() => { addBordersToElementOnButtonHover(component.id) }}>
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
            <div>
                <input value={url} onChange={(e) => { const value = e.target.value; setUrl(value); }} />
                <Button onClick={onFetchClicked}>Fetch data</Button>
                <div className='row'>

                    <div className='col-sm-6' style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                        <React.Fragment>
                            {digDeepComponents(components)}
                        </React.Fragment>
                    </div>
                    <div className='col-sm-6' style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                        <React.Fragment>
                            {digDeep(information, [])}
                        </React.Fragment>
                    </div>
                    <div className='col-sm-12'>
                        <span>{currentMapping.component.join(' ')}</span> - <span>{currentMapping.info.join(' ')}</span> <Button class='success' onClick={onMappingsAdd}>Add</Button>
                    </div>
                    <div className='col-sm-8'>
                        {mappings.map((mapping, idx) => (<div> <span>{mapping.component.join(' ')}</span> - <span>{mapping.info.join(' ')}</span> <Button class='danger' onClick={() => { onMappingDelete(idx) }}>Delete</Button></div>))}
                    </div>
                    <div className='col-sm-4'>
                        <Button class='warning' onClick={onMapComponentsClick}>Run mapping</Button>
                    </div>
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