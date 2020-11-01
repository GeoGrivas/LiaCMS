import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import * as actions from './store/actions/index';
import Spinner from '../UI/Spinner/Spinner.js';
const Auth = props => {
    const [state, setState] = useState({
        controls: {

            email: {
                label: "Username",
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your username'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                label: 'Password',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignup: true
    });

    useEffect(() => {

        if (props.redirectPath !== '/') {
            props.onSetAuthRedirectPath();
        }
    });
    const switchAuthModeHandler = () => {
        setState(prevState => {
            return { isSignup: !prevState.isSignup };
        })
    }
    const checkValidity = (value, rules) => {
        let isValid = true;
        if (!rules)
            return;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.trim().length >= rules.minLength && isValid;
        }
        if (rules.maxLength) {
            isValid = value.trim().length <= rules.maxLength && isValid;
        }
        return isValid;
    }
    const inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...state.controls,
            [controlName]: {
                ...state.controls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, state.controls[controlName].validation),
                touched: true
            }
        };
        setState({ controls: updatedControls });
    }
    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(state.controls.email.value, state.controls.password.value, state.isSignup);
    }
    const formElements = [];
    for (let key in state.controls) {
        formElements.push({ id: key, config: state.controls[key] });
    }
    let form = formElements.map(formElement => (
        <Input
            label={formElement.config.label}
            changed={(event) => { inputChangedHandler(event, formElement.id) }}
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation && formElement.config.touched}
        />
    ));
    if (props.loading) {
        form = <Spinner />;
    }
    let errorMessage = null;
    if (props.error) {
        errorMessage = (<p>{props.error.message}</p>);
    }

    if (props.isAuthenticated) {
        //form = <Redirect to={props.redirectPath} />
    }
    //<Button btnType="Danger" click={switchAuthModeHandler}>Change to {state.isSignup ? "sign in" : "sign up"}</Button>
    return (
        <div>
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">Submit</Button>
            </form>
            <div>
                <a href="/forgot-password">Forgot your password?</a>
            </div>
            <div>
                <Button btnType="Information">Register</Button>
            </div>
        </div>
    );
}



const mapStateToProps = state => {
    if (state) {
        return {
            loading: state.auth.loading,
            error: state.auth.error,
            isAuthenticated: state.auth.token != null,
            redirectPath: state.auth.authRedirectPath
        };
    } else {
        return {};
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);