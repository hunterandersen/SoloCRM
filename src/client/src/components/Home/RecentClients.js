import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class RecentClients extends Component{
    constructor(){
        super();
        this.state = {
            clientInfo: []
        };
    }
    
    componentDidMount(){
        fetch('/recentClients')
        .then(res => res.json())
        .then(singleInfo => this.setState({clientInfo: singleInfo}));
    }

    render(){
        if (this.state.clientInfo.length > 0){
            return(
                <div className="flex-vertical">
                    <h2 className="header-center">Recent Clients</h2>
                    <div className="recents flex">
                        {this.state.clientInfo.map(client => 
                            <Link key={client.idclient} to={`/client/?${client.idclient}`} className="clientCard">
                                <h4 className="preview-text">{client.firstName} {client.lastName}</h4>
                                <h4 className="preview-text">Last Tuning Date</h4>
                                <h4 className="preview-text">{client.city}</h4>
                            </Link>
                        )}
                    </div>
                </div>
            )
        }
        return(
            <h2>No Clients Loaded...</h2>
        );
    }

}

export default RecentClients;