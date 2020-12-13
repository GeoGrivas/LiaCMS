import React, { useState } from 'react';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from 'axios';
import Button from '../../../components/UI/Button/Button';
import {getRedeployUrl} from '../../Requests';
const Redeploy = (props) => {
    const [loading, setLoading] = useState(false);
    const onRedeployCliked = () => {
        setLoading(true);
        axios.get(getRedeployUrl()).then(resp => {
            setLoading(false);
        }).catch(err => {
            console.log(err);
        });


    }
    return <div>
        {loading ?
            <React.Fragment>
                <Button class='warning' disabled>Redeploying...</Button>
                <Spinner />
            </React.Fragment>
            :
            <Button class='warning'
                onClick={onRedeployCliked}
            >Redeploy</Button>
        }
    </div>
}

export default Redeploy;