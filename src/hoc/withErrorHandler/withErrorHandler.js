import React,{Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux';
import axios from '../../axios-orders';
const withErrorHandler=(WrappedCompontnt)=>{
    return class extends Component{
        state={
            error:null
        };
        componentWillMount(){
            this.reqInterceptor=axios.interceptors.request.use(request=>{
                this.setState({error:null});
                return request;
            });
            this.resInterceptor=axios.interceptors.response.use(res=>res,error=>{
                this.setState({error:error});
            });
        }
        errorConfirmedHandler=()=>{
            this.setState({error:null});
        }
      render(){
           return(
            <Aux>
                <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}> 
                    {this.state.error!=null?this.state.error.message:null}
                </Modal>
             <WrappedCompontnt {...this.props}></WrappedCompontnt>
            </Aux>
            );
      }  
    } 
}

export default  withErrorHandler;