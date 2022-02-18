import React, {Component} from 'react';

class RecentClient extends Component{
    constructor(){
        super();
        this.state = {
            clientInfo: ['Client Name def', 'Last Tuning Date def', 'City def']
        };
    }
    
    componentDidMount(){
        fetch('/clientCard')
        .then(res => res.json())
        .then(singleInfo => this.setState({clientInfo: singleInfo}, () => console.log(this.state.clientInfo)));
    }

    render(){
        console.log(`Render: ${this.state.clientInfo[0].idclient}`);
        return(
            <div className="clientCard">
                <h4 className="preview-text">{this.state.clientInfo[0].firstName} {this.state.clientInfo[0].lastName}</h4>
                <h4 className="preview-text">Last Tuning Date</h4>
                <h4 className="preview-text">{this.state.clientInfo[0].city}</h4>
            </div>
        );
    }
}

export default RecentClient;