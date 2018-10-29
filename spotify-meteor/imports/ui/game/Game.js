import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../api/sessions";
import "./Game.css";

class Game extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      state: 0 // 0: Select Playlists, 1: Select songs length, 2: In Lobby
    };
  }

  render() {
    let toRender = <div/>;

    return (
      <div>
        <div id="session-info-container">
          <div id="session-img"/>
          <div id="session-info-text">
            <div>SessionID</div>
            <h1>{this.props.session.id}</h1>

            <span>
              <span className="session-info-label">Created By </span>
              <b>
                {Object.keys(this.props.session.users)[0]}
              </b>
            </span>

            <span>
              <span className="session-info-label">Songs: </span>
              <b>
                {this.props.session.config.playlist
                  ? this.props.session.config.playlist.tracks.length
                  : <i className="fas fa-comments"/>}
              </b>
            </span>

            <span>
              <span className="session-info-label">Players: </span>
              <b>
                {Object.keys( this.props.session.users ).length}
              </b>
            </span>

          </div>
        </div>
        {toRender}
      </div>
    );
  }
}

Game.propTypes = {
  status: PropTypes.number.isRequired, // 1: Create, 2: Join
  sessionID: PropTypes.number.isRequired,
  session: PropTypes.object
};

export default withTracker( ( props ) => {
  Meteor.subscribe( "current-session" );
  return {
    session: Sessions.findOne( { id: props.sessionID } ),
    sessionID: props.sessionID
  };
} )( Game );
