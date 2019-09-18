import React,{Component} from 'react';

class NoMatch extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let staticContext = this.props.staticContext?this.props.staticContext:{};
        staticContext.status = 404;
        return(
            <h1> 404! page not found</h1>
        )
    }
}

export default NoMatch;