import React,{Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import NoMatch from './NoMatch';
import Navbar from './Navbar';
import Backend from './Backend'
import Frontend from './Frontend';

class Routes extends Component{
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Frontend} />
                <Route path="/backend" component={Backend} />
                <Route path="*" component={NoMatch} />
            </Switch>
        )
    }
}

export default Routes;