import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class SearchForm extends Component{

    constructor(){
        super();
        this.state = {
            clientAbbList : []
        }
        this.filterClients = this.filterClients.bind(this);
        this.copyClientAddress = this.copyClientAddress.bind(this);
    }

    filterClients(event){
        let searchString = "";
        let tempArray = [];
        this.state.clientAbbList.map((obj, index, array) => {
            searchString = `${obj.firstName} ${obj.lastName} ${obj.city}`;
            if(searchString.toLowerCase().includes(event.target.value.toLowerCase()))
            {
                array[index].isEnabled = true;
            }
            else{
                array[index].isEnabled = false;
            }
            tempArray = array;
            return(null);
        }
        );
        this.setState({clientAbbList: tempArray});
    }

    copyClientAddress(clientId){
        //fetch the client address info and then save it to the clipboard
        fetch(`/client/address/${clientId}`, {
            method:'GET',
            mode:'cors',
            cache:'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(resData => {
            let obj = resData[0];
            let keys = Object.keys(obj);
            let clipboardString = '';
            for(let i = 0; i<keys.length; i++){
                if(obj[keys[i]]){
                    clipboardString += `${obj[keys[i]]}`;
                    if(i+1 < keys.length){
                        clipboardString += ', ';
                    }
                }
                
            }
            //saves to the clipboard
            navigator.clipboard.writeText(clipboardString);
        })
        .catch((error) => {console.error(`Error: `, error);})

    }

    componentDidMount(){
        fetch('/clientAbbList')
        .then(res => res.json())
        .then(client => {
            for (let i = 0; i<client.length; i++)
            {
                client[i].isEnabled = true;//Add the isEnabled value to each object
            }
            this.setState({clientAbbList: client});
        });
        
    }

    render(){
        return(
            <div className="flex-vertical">
                <h1 className="header-center">Find A Client</h1>
                <form className="searchForm">
                    <input className="searchBox" type="text" value={this.state.searchValue} onChange={this.filterClients} placeholder="Search for a client here..." />
                </form>
                <ul className="client-list">
                    {this.state.clientAbbList.map((val, index, array) => {
                        if(val.isEnabled){
                            return(
                                <li key={index}>
                                    <Link to={`/client/?${val.idclient}`} className="clientResult">
                                        <h4 className="clientResultText">{val.firstName} {val.lastName}</h4>
                                        <h4 className="clientResultText">Last Tuning: 12-22-2021</h4>
                                        <h4 className="clientResultText">Repeat Call Date: 12-22-2021</h4>
                                        <h4 className="clientResultText">{val.address1}</h4>
                                        <h4 className="clientResultText">{val.city} {val.state} {val.notes1}</h4>
                                    </Link>
                                    <button className="clientResultButton" onClick={() => this.copyClientAddress(val.idclient)}>Copy Address</button>
                                </li>
                            )
                        }else{
                            return(null);
                        }
                    })}
                </ul>
            </div>
        );
    }
}

export default SearchForm;