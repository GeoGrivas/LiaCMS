import React, { useState } from 'react';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from 'axios';
import Button from '../../../components/UI/Button/Button';
const Redeploy = (props) => {
    const [loading, setLoading] = useState(false);
    const onRedeployCliked = () => {
        setLoading(true);
        axios.get('https://api.vercel.com/v1/integrations/deploy/QmVsq6DCBptN6PsZjdRqAhhmSvfY7URqan6m1KTC65JSJH/OPLjPH4YGi').then(resp => {
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