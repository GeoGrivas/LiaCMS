import React, { useEffect, useState } from 'react';
import axios from '../../../../Helpers/axiosInstance';
import * as requests from '../../../Requests';
import Button from '../../../../components/UI/Button/Button';
const TemplatesManager = (props) => {

    const [templates, setTemplates] = useState([]);
    const [templateName, setTemplateName] = useState('');
    useEffect(() => {
        loadTemplates();
    }, []);
    const loadTemplates = () => {
        axios.get(requests.getTemplates()).then(resp => {
            setTemplates(resp.data);
        }).catch(err => {
        })
    }
    const onSelectChange = (event) => {
        axios.get(requests.getTemplate(event.target.value)).then(resp => {
            props.loadTemplateMappings(JSON.parse(resp.data.mappings));
            setTemplateName(resp.data.name);
        }).catch(err => {
        })
    }
    const onTemplateSave = () => {
        axios.put(requests.putTemplate(), { Name: templateName, Mappings: JSON.stringify(props.getCurrentTemplate()) }).then(resp => {
            loadTemplates();
        }).catch(err => {
        });
    }
    const onTemplateDelete = () => {
        axios.delete(requests.deleteTemplate(templateName)).then(resp => {
            loadTemplates();
        }).catch(err => {
        })
    }
    return (
        <div>
            <label>Template name</label><br />
            <input value={templateName} onChange={(e) => { const value = e.target.value; setTemplateName(value) }} />
            <select onChange={onSelectChange}>
                <option value=''>Select a template</option>
                {templates.map(template => <option key={template}>{template}</option>)}
            </select>
            <div>
                <Button class='success' onClick={onTemplateSave}>Save</Button>
                <Button class='danger' onClick={onTemplateDelete}>Delete</Button>
            </div>

        </div>);
}

export default TemplatesManager;