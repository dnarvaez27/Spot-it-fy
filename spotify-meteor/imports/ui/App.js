import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import axios from "axios";
import AccountsUIWrapper from "./AccountsUIWrapper";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
import Session from "./game_n_lobby/Session/Session";
import Modal from "./modal/Modal";
import { CookiesProvider } from "react-cookie";

// export const BACKEND_URL = "https://spot-it-fy.herokuapp.com";
export const BACKEND_URL = "http://localhost:3000";

class App extends Component {

  constructor( props ) {
    super( props );
    
    this.playSongURI = this.playSongURI.bind( this );
    this.toggle = this.toggle.bind( this );
    this.openModal = this.openModal.bind( this );
    this.closeModal = this.closeModal.bind( this );
    this.errorModal = this.errorModal.bind( this );
    this.openStart = this.openStart.bind( this );
    
    this.login = this.login.bind(this);
    this.openLogin =this.openLogin.bind(this);
    this.openRegister=this.openRegister.bind(this);
    this.openProfile = this.openProfile.bind(this);
    this.openChangePassword = this.openChangePassword.bind(this);
    this.logout=this.logout.bind(this);
    this.register = this.register.bind(this);
    this.validateInput = this.validateInput.bind(this);

    this.usernamesignupinput = React.createRef();
    this.usernamelogininput = React.createRef();

    this.deviceID = undefined;
    this.played = false;

    this.modalRef = React.createRef();
    this.imgBannerRef = React.createRef();
  }

  playSongURI( uri ) {
    axios.put( `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceID}`,
      {
        uris: [ uri ],
        position_ms: 0 // Optional, start point
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.spotify.access_token}`
        }
      } )
      .then( () => {
        this.played = true;
      } );
  }

  static getPlaylist() {
    const playlistURIs = [ "65tIxhnn1r1yQnO8vh6ida" ];
    return playlistURIs[ 0 ];
  }

  toggle() {
    const url = `${this.played ? "pause" : "play"}`;
    axios.put( `https://api.spotify.com/v1/me/player/${url}?device_id=${this.deviceID}`, {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.spotify.access_token}`
      }
    } ).then( () => {
      this.played = !this.played;
    } );
  }

  openModal( data, cbkc, onClose ) {
    this.modalRef.current.updateData( data, cbkc, onClose );
  }

  closeModal() {
    this.modalRef.current.closeModal();
  }

  errorModal( err ) {
    this.modalRef.current.showError( err );
  }

  openStart(){
    this.openModal( {
      title: "Start",
      body: (
        <div id="start-modal-body-container">
          <img src="/images/Start.jpg"/>
          <div id="start-modal-foot-container">
            <span>
              Play with your friends and find out who is the Guru of the songs!
            </span>
            <div>
              <button onClick={() => this.openLogin()}>Login</button>
              <button onClick={() => this.openRegister()}>Signup</button>
            </div>
          </div>
        </div>
      ),
      foot: (undefined)
    } );
  }

  // User Functions
  login(username, pass){

    if(!username || !pass){
      this.showErrorModal("Please provide all the fields");
    }
    else{
      Meteor.loginWithPassword(username, pass, (err)=>{
        if(err){
          this.showErrorModal(err.message);
        }
        else{
          this.closeModal();
        }
      });
    }
  }

  register(username, pass, confirmPass){
    username = username.replace(/\W/g, '');
    if(!username || !pass || !confirmPass){
      this.showErrorModal("Please provide all the fields")
    }
    else{
      if(pass !== confirmPass){
        this.showErrorModal("Password does not match")
      }
      else{
        Accounts.createUser({
          username: username,
          password: pass
        }, err => {
          if(err){
            this.showErrorModal(err.message);
          }
          else{
            this.closeModal();
          }
        });
      }
    }
  }

  execOnEnter(e, func, args){
    if (e.key === 'Enter') {
      func(...args);
    }
  }

  openLogin(){
    let username, pass;
    this.openModal( {
      title: "Login",
      body: (
        <div id="login-conatiner">
          <input 
            type="text" 
            placeholder="Username" 
            onChange={e => username = e.target.value} 
            onKeyPress={(e) => this.execOnEnter(e, this.login, [username, pass])}
            onKeyDown={e => this.validateInput(e,this.usernamelogininput)}
            ref={this.usernamelogininput}/>
          <input type="password" placeholder="Password" onChange={e => pass = e.target.value} onKeyPress={(e) => this.execOnEnter(e, this.login, [username, pass])}/>
        </div>
      ),
      foot: (
        <div id="login-footer">
          <button className="button-cancel" onClick={this.closeModal}>Cancel</button>
          <button className="button-login" onClick={() => this.login(username, pass)}>Login</button>
        </div>
      )
    } );
  }

  validateInput(e, inputRef){
    if (!e.key.match(/[a-zA-Z0-9]/) || e.keyCode === 186) {
      e.preventDefault();
    }

    let a = inputRef.current.value.replace(/\W/g, '');
    if(inputRef.current.value !== a) {
      inputRef.current.value = a;
      e.preventDefault();
    }
  }

  openRegister(){
    let username, pass, passCheck;
    this.openModal( {
      title: "Signup",
      body: (
        <div id="login-conatiner">
          <input 
            type="text" 
            placeholder="Username" 
            onChange={e => username = e.target.value} 
            onKeyPress={(e) => this.execOnEnter(e, this.register, [username, pass, passCheck])}
            onKeyDown={e => this.validateInput(e, this.usernamesignupinput)}
            ref={this.usernamesignupinput}/>
          <input type="password" placeholder="Password" onChange={e => pass = e.target.value} onKeyPress={(e) => this.execOnEnter(e, this.register, [username, pass, passCheck])}/>
          <input type="password" placeholder="Confirm Password" onChange={e => passCheck = e.target.value} onKeyPress={(e) => this.execOnEnter(e, this.register, [username, pass, passCheck])}/>
        </div>
      ),
      foot: (
        <div id="login-footer">
          <button className="button-cancel" onClick={this.closeModal}>Cancel</button>
          <button className="button-login" onClick={() => this.register(username, pass, passCheck)}>Signup</button>
        </div>
      )
    } );
  }

  openProfile(){
    this.openModal( {
      title: this.props.user.username,
      body: (
        <div id="login-conatiner">

        </div>
      ),
      foot: (
        <div id="login-footer">
          <button className="button-cancel" onClick={this.openChangePassword}>Change Password</button>
          <button className="button-login" onClick={this.logout}>Logout</button>
        </div>
      )
    } );
  }

  alert(){
    console.log(123);
  }

  changePassword(old, newPass, confNewPass){
    if(newPass !== confNewPass){
      this.showErrorModal("Password does not match");
    }
    else {
      Accounts.changePassword(old, newPass, (err) => {
        if(err){
          this.props.showErrorModal(err);
        }
        else {
          this.openProfile();
        }
      });
    }
  }

  logout(){
    Meteor.logout(() => {
      this.closeModal();
    });
  }

  openChangePassword(){
    let old, newPass, confirmPass;
    this.openModal( {
      title: "Change Password",
      body: (
        <div id="login-conatiner">
          <input type="password" placeholder="Current password" onChange={e => old = e.target.value}/>
          <input type="password" placeholder="New password" onChange={e => newPass = e.target.value}/>
          <input type="password" placeholder="Confrim new password" onChange={e => confirmPass = e.target.value}/>
        </div>
      ),
      foot: (
        <div id="login-footer">
          <button className="button-cancel" onClick={this.openProfile}>Cancel</button>
          <button className="button-login" onClick={() => this.changePassword(old, newPass, confirmPass)}>Change Password</button>
        </div>
      )
    } );
  }

  render() {

    let content = (
      <div id="spotitfy-instructions-container">
        <div>
          <h1>How many songs can you identify?</h1>
          <span>Play it with your friends</span>
          <button onClick={this.openStart}>START</button>
        </div>
      </div>
    );

    if ( this.imgBannerRef.current ) {
      this.imgBannerRef.current.classList.remove( "banner-non-display" );
    }

    return (
      <div>
        <AccountsUIWrapper 
          openModal={this.openModal}
          closeModal={this.closeModal}
          showErrorModal={this.errorModal}
          openProfile={this.openProfile}
          openLogin={this.openLogin}
          openRegister={this.openRegister}/>
        <div id="spotitfy-img-container">
          <div id="spotitfy-img" ref={this.imgBannerRef}/>
        </div>
        {this.props.user
          ?
          <CookiesProvider>
            <Session
              imgBannerRef={this.imgBannerRef}
              openModal={this.openModal}
              closeModal={this.closeModal}
              showErrorModal={this.errorModal}/>
          </CookiesProvider>
          :
          content}
        <Modal ref={this.modalRef}/>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object
};

export default withTracker( () => {
  return {
    user: Meteor.user()
  };
} )( App );
