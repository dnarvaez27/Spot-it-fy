import React from "react";
import PropTypes from "prop-types";
import { Template } from "meteor/templating";
import { Blaze } from "meteor/blaze";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
import { withTracker } from "meteor/react-meteor-data";

class AccountsUIWrapper extends React.Component {

  constructor( props ) {
    super( props );
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
  }

  login(username, pass){

    if(!username || !pass){
      this.props.showErrorModal("Please provide all the fields");
    }
    else{
      Meteor.loginWithPassword(username, pass, (err)=>{
        if(err){
          this.props.showErrorModal(err.message);
        }
        else{
          this.props.closeModal();
        }
      });
    }
  }

  register(username, pass, confirmPass){
    username = username.current.value.replace(/\W/g, '');
    if(!username || !pass || !confirmPass){
      this.props.showErrorModal("Please provide all the fields")
    }
    else{
      if(pass !== confirmPass){
        this.props.showErrorModal("Password does not match")
      }
      else{
        Accounts.createUser({
          username: username,
          password: pass
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
    this.props.openModal( {
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
          <button className="button-cancel" onClick={this.props.closeModal}>Cancel</button>
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
    this.props.openModal( {
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
          <button className="button-cancel" onClick={this.props.closeModal}>Cancel</button>
          <button className="button-login" onClick={() => this.register(username, pass, passCheck)}>Signup</button>
        </div>
      )
    } );
  }

  openProfile(){
    this.props.openModal( {
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

  changePassword(old, newPass, confNewPass){
    if(newPass !== confNewPass){
      this.props.showErrorModal("Password does not match");
    }
    else {
      Accounts.changePassword(old, newPass, (err) => {
        if(err){
          this.props.showErrorModal(err);
        }
        else{
          this.openProfile();
        }
      });
    }
  }

  logout(){
    Meteor.logout(()=>{
      this.props.closeModal();
    });
  }

  openChangePassword(){
    let old, newPass, confirmPass;
    this.props.openModal( {
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
    return (
      <div id="accounts-container">
        {this.props.user 
          ?
          <div>
            <button id="user-profile-button" onClick={this.openProfile}>{"Hello, " + this.props.user.username}</button>
          </div>
          : 
          <div>
            <button onClick={this.openLogin}>Login</button>
            <button onClick={this.openRegister}>Signup</button>
          </div>
        } 
      </div>
    )
  }
}

AccountsUIWrapper.propTypes = {
  user: PropTypes.object,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  showErrorModal: PropTypes.func.isRequired,
};

export default withTracker(() =>{
  return {
    user: Meteor.user()
  };
})(AccountsUIWrapper)
