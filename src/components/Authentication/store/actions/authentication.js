import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime.getTime() * 1000
        );
    }
}

export const checkRefreshToken = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(refershToken());
        }, expirationTime * 1000
        );
    }
}
export const refershToken = () => {
    return dispatch=>{
    let url = '/api/authentication/refresh-token';
    axios.get(url,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            const expirationDate=new Date(response.data.expiration);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(response.data.token));
            dispatch(checkRefreshToken((expirationDate.getTime()-30 - new Date().getTime()) / 1000));
        }
        ).catch(err => {
            dispatch(authFail(err.response.data.error));
        }
        );
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const auth = (email, password, isSignup) => {
    return dispatch => {
        // authenticate user
        dispatch(authStart());
        const authData = {
            username: email,
            password: password
        }
        let url = 'https://www.adventurouscoding.com/api/authentication/register';
        if (!isSignup) {
            url = 'https://www.adventurouscoding.com/api/authentication/login';
        }
        axios.post(url, authData)
            .then(response => {
                const expirationDate=new Date(response.data.expiration);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('expirationDate', expirationDate);
                //localStorage.setItem('userId',response.data.localId);
                dispatch(authSuccess(response.data.token));
                dispatch(checkRefreshToken((expirationDate.getTime()-30 - new Date().getTime()) / 1000));
                //dispatch(checkAuthTimeout(response.data.expiration));
            }
            ).catch(err => {
                dispatch(authFail(err.response));
            }
            );
    }
}


export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
        let token=null;
        if (typeof window !== "undefined") {
            token = localStorage.getItem('token');
        }else{
            return;
        }
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                dispatch(authSuccess(token, localStorage.getItem('userId')));
                dispatch(checkRefreshToken((expirationDate.getTime() - new Date().getTime()) / 1000));
            } else {
                dispatch(logout());
            }
        }
    };
}