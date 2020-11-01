import { useStore } from 'react-redux';
import authReducer from './store/reducers/auth';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';
const InitAuthState=props=>{
    const store = useStore();
    store.injectReducer('auth',authReducer);
    props.initAuth();
return (props.children);
}


const mapDispatchToProps = dispatch => {
    return {
        initAuth: () => dispatch(actions.authCheckState())
    }
}
export default connect(null, mapDispatchToProps)(InitAuthState);