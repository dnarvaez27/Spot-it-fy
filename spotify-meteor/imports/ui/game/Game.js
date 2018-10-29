import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../api/sessions";
import "./Game.css";
import GameSetup from "../GameSetup/GameSetup";
import Players from "../Players/Players";

class Game extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      state: this.props.status, // 0: Select Playlists, 1: Select songs length, 2: In Lobby
    };
  }

  toLobby(){
    this.setState({state:2});
  }
  startGame(){
    Meteor.call("session.startGame",this.props.sessionID);
  }

  render() {
    // console.log("sessionID: ",this.props.sessionID);
    let toRender = <Players session={this.props.session}/>;
    if(this.state.state==1){
      toRender = <GameSetup spotify={this.props.spotify_tokens} toLobby={this.toLobby.bind(this)} sessionID={this.props.sessionID}/>;
    }

    let pregame = (<div>
      <div id="session-info-container">
        {this.props.session.config.duration===undefined?
          <div id="session-img"/>
          :
          <img className="bannerImg" src={this.props.session.config.imageUrl} alt="playlistImage"/>
        }
        <div id="session-info-text">
          <div>SessionID: {this.props.session.id}</div>
          {this.props.session.config.duration===undefined?
            <h1>-</h1>
            :
            <h1>{this.props.session.config.playlist.name}</h1>
          }
          

          <span>
            <span className="session-info-label">Session created by: </span>
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
      {Meteor.user().username==Object.keys(this.props.session.users)[0]?
        this.props.session.config.duration===undefined?
          ""
          :
          <div className="playButtonContainer">
            <button onClick={this.startGame.bind(this)} className="gameStart">Start game</button>
          </div>
        :
        <h1 className="pleaseWait">Please wait while party leader starts the game</h1>}
      {toRender}
    </div>);

    return (
      <div>
        {this.props.session.gameStart?<p>Game Started.</p>:pregame}
      </div>
    );
  }
}

Game.propTypes = {
  status: PropTypes.number.isRequired, // 1: Create, 2: Join
  sessionID: PropTypes.number.isRequired,
  session: PropTypes.object,
  spotify_tokens : PropTypes.object.isRequired,
};

export default withTracker( ( props ) => {
  Meteor.subscribe( "current-session" );
  return {
    session: Sessions.findOne( { id: props.sessionID } ),
    sessionID: props.sessionID,
  };
} )( Game );
