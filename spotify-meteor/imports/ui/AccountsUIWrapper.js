import React from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
import { withTracker } from "meteor/react-meteor-data";

class AccountsUIWrapper extends React.Component {
  render() {
    return (
      <div id="accounts-container">
        {this.props.user 
          ?
          <div>
            <button id="user-profile-button" onClick={this.props.openProfile}>{"Hello, " + this.props.user.username}</button>
          </div>
          : 
          <div>
            <button onClick={this.props.openLogin}>Login</button>
            <button onClick={this.props.openRegister}>Signup</button>
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
  
  openProfile: PropTypes.func.isRequired,
  openLogin: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired
};

export default withTracker(() =>{
  return {
    user: Meteor.user()
  };
})(AccountsUIWrapper)
