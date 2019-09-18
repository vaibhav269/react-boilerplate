import React,{Component} from 'react';
import dp from '../../public/images/billfreeLogo.png';

class Heading extends Component{
    render(){
        return(
            <div>
                <img src = {dp} width = "10%"/>
            </div>
        )
    }
}

export default Heading;