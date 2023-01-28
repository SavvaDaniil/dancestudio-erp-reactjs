import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/main.css";
import "./assets/css/main_mobile.css";
import "./assets/fontawesome/css/font-awesome.min.css";
import "bootstrap/dist/js/bootstrap";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminMiddleWare from "./utils/AdminMiddleware";
import {SystemErrorPage} from "./pages/SystemError/SystemErrorPage";
import {SystemLoadingPage} from "./pages/SystemLoading/SystemLoadingPage";
import PrivateRouting from './navigation/PrivateRouting';
import {LoginPageWithRouter} from "./pages/LoginPageWithRouter";
import {UserProvider} from './store/UserContext';
import constant from "./utils/GlobalValues";
import ProfilePage from './pages/ProfilePage';
import AbonementsPage from './pages/AbonementsPage';
import TeachersPage from './pages/TeachersPages';
import BranchesPage from './pages/BranchesPage';
import DanceGroupsPage from './pages/DanceGroupsPage';
import UsersPage from './pages/UsersPage';
import TeacherSalariesPage from './pages/TeacherSalariesPage';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLaunched : false,
      isError : false,
      user : {
        isAuthed : false
      }
    }
    this.checkAuthStatus = this.checkAuthStatus.bind(this);
  }

  async componentDidMount(){
    await this.checkAuthStatus();
  }

  async checkAuthStatus(){
    //console.log("checkAuthStatus");
    this.setState({isLaunched: false, isError : false});
    const adminMiddleWare = new AdminMiddleWare();
    const jwt = adminMiddleWare.getJWTFromCookie();
    //console.log(jwt);
    if(jwt === null){
      this.setState({isLaunched: true, isError : false});
      return;
    }

    fetch(constant.baseDomain + "/api/admin", 
      {
        method : "GET",
        headers : {
          "Authorization" : "Bearer " + jwt,
        }
      }
    )
    .then((response) => {
        if(response.status === 403){
          this.setState({isLaunched: true, isError : false});
          return;
        }
        return response.json();
    })
    .then((result) => {
          if(result.status === "success"){
            this.setState({isLaunched: true, isError : false, user : {isAuthed: true}});
          } else {
            this.setState({isLaunched: true, isError : false});
          }
        },
        (error) => {
          this.setState({isLaunched: true, isError : true});
        }
    );
    
  }
  
  render(){

    if(!this.state.isLaunched){
      return (
        <SystemLoadingPage />
      )
    }
    if(this.state.isError){
      return (
        <SystemErrorPage tryAgain={() => this.checkAuthStatus()} />
      )
    }
    
    return (
      <UserProvider valueUser={this.state.user}>
        <BrowserRouter>
          <Routes>
              <Route path = "/" element={<PrivateRouting/>}>
                <Route path ="/" exact element={<ProfilePage/>}></Route>
                <Route path='/users' exact element={<UsersPage/>}></Route>
                <Route path='/teacher_salaries' exact element={<TeacherSalariesPage/>}></Route>
                <Route path='/abonements' exact element={<AbonementsPage/>}></Route>
                <Route path='/teachers' exact element={<TeachersPage/>}></Route>
                <Route path='/dance_groups' exact element={<DanceGroupsPage/>}></Route>
                <Route path='/branches' exact element={<BranchesPage/>}></Route>
                
                ...

              </Route>

              <Route path="/login" exact element={<LoginPageWithRouter/>} />

          </Routes>
        </BrowserRouter>
      </UserProvider>
    );
  }
}

