import React, {useEffect, useRef, useState} from 'react';
import { useHistory } from 'react-router';
import {useLocation, NavLink} from "react-router-dom";
import Modal from 'react-modal';

export default function Client() {
    const location = useLocation();
    const id = location.search.substr(1);
    const history = useHistory();

    const [data, setData] = useState();
    const [dataChanged, setNameChanged] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const originalData = useRef();

    Modal.setAppElement(document.getElementById('root-element'));

    //Checks if the values have been changed from their initial values. and sets the dataChanged variable accordingly.
    function keyUpdate(e, val) {
        const inputElements = e.target.parentElement.parentElement.getElementsByTagName("input");
        const tempArray = dataChanged.slice();
        tempArray[val] = false;

        for(let i = 0; i<inputElements.length; i++){
            if(originalData.current[inputElements[i].name] !== inputElements[i].value){
                tempArray[val] = true;
                //break;
            }
        }
        setNameChanged(tempArray);

        let obj = data;
        obj[e.target.name] = e.target.value;
        setData(obj);
    }

    function dataSubmit(){
        console.log(`Commit Changes Pressed!`);
        
        //Check that something has actually changed and needs updating
        if(dataChanged[0] || dataChanged[1] || dataChanged[2]){
            console.log(data);
            
            //send the data to the server
            fetch(`/client/updateClient/${id}`, {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Success:', data);
                    setNameChanged([false, false, false]);
                })
                .catch((error) => {console.error('Error:', error);});
            
        }

        console.log(`JSON: ${JSON.stringify(data)}`);
    }

    function removeClient(){
        console.log("Remove the client permanently");

        //send delete request to the server
        fetch(`/client/removeClient/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(resData => {
            console.log('Success:', resData);
            history.push(`/clients`);
        })
        .catch((error) => {console.error('Delete Error:', error);})

        closeModal();
    }

    function deleteButtonClick(){
        setDeleteModalOpen(true);
    }

    function closeModal(){
        setDeleteModalOpen(false);
    }

    function hasChanges(){
        for(let i = 0; i<dataChanged.length; i++){
            if(dataChanged[i]){
                return true;
            }
        }
        return false;
    }

    //Keep the original data intact for later comparisons
    useEffect(() => {
        if(!originalData.current && data){
            originalData.current = JSON.parse(JSON.stringify(data));
            let keys = Object.keys(originalData.current);
            for(let i = 0; i < keys.length; i++){
                if((originalData.current[keys[i]] !== "") && !originalData.current[keys[i]]){
                    originalData.current[keys[i]] = "";
                }
            } 
        }
    }, [data]);

    useEffect(() => {
        fetch(`/client/${id}`)
        .then(res => res.json())
        .then(serverData => {
            setData(() => serverData[0]);
        });
        setNameChanged([false, false, false]);
    }, [id]);
    
    //Begin Return Data
    if(data===null || data===undefined){
        return <h1>Loading...</h1>;
    }
    else{
        return(
            <div className="flex-vertical" id="root-element">
                <NavLink exact to="/newClient" className="plus fixed-top-right"></NavLink>
                <div className="header-center">Client Information</div>
                <div className="flex">
                    <fieldset className={`inputFieldBox ${dataChanged[0]? "changedBorder" : "defaultBorder"}`} onChange={(e) => keyUpdate(e, 0)}>
                        <legend className="legendTitle">Name and Number</legend>
                    
                        <label className="inputLabel">First Name
                            <input name="firstName" type="text" className="inputTextField" defaultValue={data.firstName}/>
                        </label>
                        <br/>
                        <label className="inputLabel">Last Name
                            <input name="lastName" type="text" className="inputTextField" defaultValue={data.lastName}/>
                        </label>
                        <br/>
                        <label className="inputLabel">Phone #
                            <input name="phoneNumber" type="tel" className="inputTextField" pattern="[0-9]{3}-[0-9]{4}" title="Telephone Number" defaultValue={data.phoneNumber}/>
                        </label>
                        <br/>
                        <label className="inputLabel">Email Address
                            <input name="emailAddress" type="email" className="inputTextField" title="Email Address Title" defaultValue={data.emailAddress}/>
                        </label>
                    </fieldset>
                    <fieldset className={`inputFieldBox ${dataChanged[1]? "changedBorder" : "defaultBorder"}`} onChange={(e) => keyUpdate(e, 1)}>
                        <legend className="legendTitle">Address</legend>
                    
                        <label className="inputLabel">Street Address
                            <input name="address1" type="text" className="inputTextField" defaultValue={data.address1}/>
                        </label>
                        <br/>
                        <label className="inputLabel">City
                            <input name="city" type="text" className="inputTextField" defaultValue={data.city}/>
                        </label>
                        <br/>
                        <label className="inputLabel">State
                            <input name="state" type="text" maxLength="2" className="inputState" pattern="[A-Za-z]" defaultValue={data.state}/>
                        </label>
                        <br/>
                        <label className="inputLabel">ZIP
                            <input name="zip" type="text" maxLength="5" className="zipInfo" defaultValue={data.zip}/>
                        </label>
                    </fieldset>
                </div>
                <div className="flex">
                    <fieldset className={`inputFieldBox ${dataChanged[2]? "changedBorder" : "defaultBorder"}`} onChange={(e) => keyUpdate(e, 2)}>
                        <legend className="legendTitle">Extra Info</legend>
                    
                        <label className="inputLabel">Gate Code
                            <input name="gateCode" type="text" className="inputTextField" defaultValue={data.gateCode}/>
                        </label>
                        <br/>
                        <label className="inputLabel">Notes #1
                            <input name="notes1" type="text" className="inputTextField" defaultValue={data.notes1}/>
                        </label>
                        <br/>
                        <label className="inputLabel">Notes #2
                            <input name="notes2" type="text" className="inputTextField" defaultValue={data.notes2}/>
                        </label>
                    </fieldset>
                </div>
                <button disabled={!hasChanges()} className="submitButton" type="submit" onClick={() => dataSubmit()}>Commit Changes</button>
                <button className="deleteButton" onClick={() => deleteButtonClick()}>Delete Client</button>
                <Modal className="Modal" overlayClassName="Overlay" isOpen={isDeleteModalOpen} onRequestClose={closeModal} shouldCloseOnOverlayClick={true}>
                    <h1>Are you sure you want to remove this client forever?</h1>
                    <button className="modalButton" onClick={closeModal}>No, Keep this Client</button>
                    <button className="modalButton" onClick={removeClient}>Yes, Delete this Client Forever</button>
                </Modal>
            </div>
            );
        }//End Else for Return Data
    
}

/*

POST new Client Data
fetch('/client/newClient', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(data => {console.log('Success:', data);})
    .catch((error) => {console.error('Error:', error);});

*/