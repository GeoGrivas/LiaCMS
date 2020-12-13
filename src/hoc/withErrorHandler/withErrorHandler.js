import React, { Component } from 'react';
import axios from '../../Helpers/axiosInstance';
import Alert from '../../components/UI/Alert/Alert';
const withErrorHandler = (WrappedCompontnt) => {
    return class extends Component {
        state = {
            error: null
        };
        componentDidMount() {
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({ error: error });
                if(error)
                {
                    throw error; 
                }
            });
            
        }
        closeErrorHandler = () => {
            this.setState({ error: null });
        }
        render() {
            return (
                <React.Fragment>
                    {this.state.error !== null ?
                        <Alert class='danger' onClose={this.closeErrorHandler}>
                            {this.state.error.message}
                        </Alert> : null
                    }
                    <WrappedCompontnt {...this.props}></WrappedCompontnt>
                </React.Fragment>
            );
        }
    }
}

export default withErrorHandler;