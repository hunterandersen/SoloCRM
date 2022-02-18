import React, {useState} from 'react';
import { useHistory } from 'react-router';

export default function AddClient(){
    const [data, setData] = useState();
    const history = useHistory();

    function keyUpdate(e){
        let obj = data;
        if(!data){
            obj = {'tempName':''};
            obj[e.target.name] = e.target.value;
            delete obj['tempName'];
        }else{
            obj[e.target.name] = e.target.value;
        }
        setData(obj);
    }

    function dataSubmit(){
        
        //POST new Client Data
        fetch('/client/newClient', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            })
            .then(res => res.json(), res => {
                console.log("Ruh Roh:");
                console.log(res);
            })
            .then(resData => {
                //console.log('Success:', resData);
                console.log(`ResData: ${resData}`);
                history.push(`/client/?${resData.insertId}`);
            })
            .catch((error) => {
                //console.log(error);
                console.error('MYError:', error);
            });

    }

    return(
        <div className="flex-vertical">
                <div className="header-center">New Client Form</div>
                <div className="flex">
                    <fieldset className={`inputFieldBox defaultBorder`} onChange={(e) => keyUpdate(e, 0)}>
                        <legend className="legendTitle">Name and Number</legend>
                    
                        <label className="inputLabel">First Name
                            <input name="firstName" type="text" className="inputTextField"/>
                        </label>
                        <br/>
                        <label className="inputLabel">Last Name
                            <input name="lastName" type="text" className="inputTextField"/>
                        </label>
                        <br/>
                        <label className="inputLabel">Phone #
                            <input name="phoneNumber" type="tel" className="inputTextField" pattern="[0-9]{3}-[0-9]{4}" title="Telephone Number"/>
                        </label>
                        <br/>
                        <label className="inputLabel">Email Address
                            <input name="emailAddress" type="email" className="inputTextField" title="Email Address Title"/>
                        </label>
                    </fieldset>
                    <fieldset className={`inputFieldBox defaultBorder`} onChange={(e) => keyUpdate(e, 1)}>
                        <legend className="legendTitle">Address</legend>
                    
                        <label className="inputLabel">Street Address
                            <input name="address1" type="text" className="inputTextField"/>
                        </label>
                        <br/>
                        <label className="inputLabel">City
                            <input name="city" type="text" className="inputTextField"/>
                        </label>
                        <br/>
                        <label className="inputLabel">State
                            <input name="state" type="text" maxLength="2" className="inputState" pattern="[A-Za-z]"/>
                        </label>
                        <br/>
                        <label className="inputLabel">ZIP
                            <input name="zip" type="text" maxLength="5" className="zipInfo"/>
                        </label>
                    </fieldset>
                </div>
                <div className="flex">
                    <fieldset className={`inputFieldBox defaultBorder`} onChange={(e) => keyUpdate(e, 2)}>
                        <legend className="legendTitle">Extra Info</legend>
                    
                        <label className="inputLabel">Gate Code
                            <input name="gateCode" type="text" className="inputTextField" />
                        </label>
                        <br/>
                        <label className="inputLabel">Notes #1
                            <input name="notes1" type="text" className="inputTextField"/>
                        </label>
                        <br/>
                        <label className="inputLabel">Notes #2
                            <input name="notes2" type="text" className="inputTextField"/>
                        </label>
                    </fieldset>
                </div>
                <button className="submitButton" type="submit" onClick={() => dataSubmit()}>Create Client</button>
            </div>
    );
}