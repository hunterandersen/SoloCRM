import './css/style.css';
import RecentClients from './components/Home/RecentClients';
import Navbar from './components/Home/Navbar';
import SearchForm from './components/Searching/SearchForm';
import Client from './components/Searching/Client';
import AddClient from './components/NewData/AddClient';
import Calendar from './components/Calendar/Calendar';

import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
// import UserAuthenticate from './components/Authentication/UserAuthenticate';

function App() {
  return (
    <BrowserRouter>
        <Navbar />
        {/* <UserAuthenticate /> */}
        <Switch>
            <Route exact path="/">
                <div>
                    <NavLink exact to="/newClient" className="plus fixed-top-right"></NavLink>
                    <RecentClients />
                </div>
            </Route>
            <Route path="/clients">
                <div>
                    <NavLink exact to="/newClient" className="plus fixed-top-right"></NavLink>
                    <SearchForm />
                </div>
            </Route>
            <Route path="/calendar">
                <Calendar />
            </Route>
            <Route path="/client" /*component={Client}*/>
                <Client />
            </Route>
            <Route path="/newClient">
                <AddClient/>
            </Route>
        </Switch>
    </BrowserRouter>
  );
}

export default App;

/*
CALENDAR STUFF

<h2 className="header-center">Upcoming</h2>
<div className="cal-preview flex">
    <div className="calendarCard">
        <h3>Monday</h3>
        <h4>10:00am</h4>
    </div>
    <div className="calendarCard">
        <h3>Tuesday</h3>
        <h4>11:30am</h4>
    </div>
    <div className="calendarCard">
        <h3>Wednesday</h3>
    </div>
    <div className="calendarCard">
        <h3>Thursday</h3>
        <h4>2:00pm</h4>
    </div>
</div>

*/