import React from "react";
import PropTypes from "prop-types";
import "./SelectGame.css";
import { Sessions } from "../../../api/sessions";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

class SelectGame extends React.Component {

  constructor( props ) {
    super( props );
    this.createSession = this.createSession.bind( this );
    this.joinSession = this.joinSession.bind( this );
  }

  createSession() {
    let curSession = this.props.sessions;
    curSession = isNaN( curSession ) ? 1 : curSession + 1;
    Meteor.call( "session.create", curSession, this.props.user,
     () => {
       this.props.updateSession( 1, curSession );
     } );
  }

  joinSession() {
    let inputValue = "";
    let self = this;
    let inputRef = React.createRef();

    function join() {
      let sessionID = parseInt( inputValue );
      Meteor.call( "session.join", sessionID, self.props.user,
       ( error ) => {
         if ( !error ) {
           self.props.updateSession( 2, sessionID );
           self.props.closeModal();
         }
         else {
           self.props.showErrorModal( error.error );
         }
       } );
    }

    function handleChange( ev ) {
      inputValue = ev.target.value;
    }

    function onKeyPress( ev ) {
      if ( ev.key === "Enter" ) {
        join();
      }
    }

    this.props.openModal( {
        title: "Join Session",
        body: (
          <div id="session-join-content">
            <input type="number"
                   min="1"
                   placeholder="Session ID"
                   onChange={handleChange}
                   ref={inputRef} onKeyPress={onKeyPress}/>
          </div>
        ),
        foot: (
          <div id="session-join-ok-content">
            <button onClick={join}>
              <i className="fas fa-check"/>
            </button>
          </div>
        )
      }, () => {
        inputRef.current.focus();
      } );
  }

  render() {
    return (
      <div id="session-choice-container">
        <div onClick={this.createSession}>
          <h1>Create</h1>
        </div>
        <div onClick={this.joinSession}>
          <h1>Join</h1>
        </div>
      </div>
    );
  }
}

SelectGame.propTypes = {
  user: PropTypes.object,
  sessions: PropTypes.number,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  showErrorModal: PropTypes.func.isRequired,
  updateSession: PropTypes.func.isRequired
};

export default withTracker( () => {
  Meteor.subscribe( "sessions" );
  Meteor.subscribe( "user.info" );

  return {
    sessions: Sessions.find( {} ).count(),
    user: Meteor.user()
  };
} )( SelectGame );
