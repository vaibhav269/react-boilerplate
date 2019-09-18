import React,{Component} from 'react';
import Login from './Login';
import Home from './Home';
import { BrowserRouter as Router,Route,Switch } from "react-router-dom";

class Backend extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let match = this.props.match;
        return(
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path={`${match.path}/`}  component={Home} />
                            <Route exact path="/backend/login/" component={Login} />
                            {/* <Route component = {Login}/> */}
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }
}

export default Backend;