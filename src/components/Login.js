import React,{Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser,faKey} from '@fortawesome/free-solid-svg-icons';
import Heading from './Heading';
import AuthService from './AuthService';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username:undefined,
            password:undefined
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.Auth = new AuthService();
        if(this.Auth.loggedIn())
            this.props.history.replace('/');
    }

    handleChange(e){
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    handleLogin(e){
        e.preventDefault();
        this.Auth.login(this.state.username,this.state.password)
        .then((res)=>{
            this.props.history.replace('/');
        })
        .catch(err=>{
            alert(err);
        })
    }

    render(){
        return(
            <div className = "container-fluid mt-5">
                
                <div className="row no-gutters mb-5">
                    <div className="col-12 text-center">
                        <Heading/>
                    </div>
                </div>

                <div className = "row no-gutters justify-content-center" >
                    <div className = "col-lg-3 col-12 border" 
                        style = {{
                                    fontFamily:'monospace',
                                    fontSize:'110%',
                                    backgroundColor:'#fff',
                                    boxShadow: '0 6px 16px 0 rgba(115,143,147,.4)'
                                }}
                    >
                        <div className = "p-2 text-center" style = {{ backgroundColor:'#5c8139', color:'#fff'}}>Login</div>
                        <form className = "p-2 pt-0" onSubmit = {this.handleLogin}>
                            <div className = "form-group">
                                <div className = "border p-2 rounded" style = {{backgroundColor:'#f3f7f7'}}>
                                    <div className = "d-inline-block text-center" style = {{width:'10%'}} >
                                        <FontAwesomeIcon 
                                                icon = {faUser} 
                                                size = "sm"
                                            />                        
                                    </div>
                                    <input 
                                        type = "text" 
                                        name = "username" 
                                        onChange = {this.handleChange}
                                        className = "d-inline-block border-0" 
                                        style = {{ 
                                            width:'90%',
                                            fontFamily:'monospace',
                                            outline:'none',
                                            backgroundColor:'#f3f7f7',
                                            color:'#2C0703',
                                            lineHeight:'1.5',
                                            fontSize:'80%'
                                        }}
                                        placeholder = "Email or Mobile"
                                    />
                                </div>                        
                            </div>

                            <div className = "form-group">
                                <div className = "border p-2 rounded" style = {{backgroundColor:'#f3f7f7'}}>
                                    <div className = "d-inline-block text-center" style = {{width:'10%'}} >
                                        <FontAwesomeIcon 
                                            icon = {faKey} 
                                            size = "sm"
                                        />
                                    </div>
                                    <input 
                                        type = "password" 
                                        name = "password" 
                                        onChange = {this.handleChange}
                                        className = "d-inline-block border-0" 
                                        style = {{ 
                                            width:'90%',
                                            fontFamily:'monospace',
                                            outline:'none',
                                            backgroundColor:'#f3f7f7',
                                            color:'#2C0703',
                                            lineHeight:'1.5',
                                            fontSize:'80%'
                                        }}
                                        placeholder = "Password"
                                    />
                                </div>                        
                            </div>

                            <div className = "text-right mt-4">
                                <button type = "submit" className = "btn p-2 rounded-0" 
                                    style = {{
                                        fontSize:'80%',
                                        fontFamily:'monospace',
                                        boxShadow: '0 6px 16px 0 rgba(115,143,147,.4)',
                                        color:'white',
                                        opacity:'0.8',
                                        backgroundColor:'#5c8139'
                                        }}>
                                    <b>Login</b>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;