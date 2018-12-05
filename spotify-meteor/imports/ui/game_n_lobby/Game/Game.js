import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import "./Game.css";
import GameSetup from "../../setup/GameSetup/GameSetup";
import Players from "../Players/Players";
import BasicInfo from "../BasicInfo/BasicInfo";
import Spotitfy from "../Spotitfy/Spotitfy";
import axios from "axios";

const fields = "name,description,images,tracks.items(track(album,artists,duration_ms,id,name,uri))";

class Game extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      state: this.props.status, // 0: Select Playlists, 1: Select songs length, 2: In Lobby,
      playlistData: undefined
    };
  }

  toLobby( fullPlaylist ) {
    this.setState( { state: 2, playlistData: fullPlaylist } );
  }

  startGame() {
    Meteor.call( "session.startGame", this.props.sessionID );
  }

  loadPlaylist(){
    const url_info = `https://api.spotify.com/v1/playlists/${this.props.session.config.playlist.id}?fields=${fields}`;
    axios.get( url_info, { headers: { "Authorization": `Bearer ${this.props.spotify_tokens.access_token}` } } )
      .then( response => {
        this.setState( { playlistData: response.data } );
      } );
  }

  render() {
    if(this.props.session.config.playlist && !this.state.playlistData){
      this.loadPlaylist();
    }

    let render = (
      <Spotitfy
        session={this.props.session}
        spotify_tokens={this.props.spotify_tokens}
        fullPlaylist={this.state.playlistData}
        changeState={this.props.changeState}/>
    );

    if(!this.props.session.gameStart){
      let start = "";
      if(Meteor.user().username === Object.keys( this.props.session.users )[ 0 ]){
        if(this.props.session.config.duration !== undefined){
          start = (
            <div className="playButtonContainer">
              <button onClick={this.startGame.bind( this )} className="gameStart">Start game</button>
            </div>
          );
        }
      }
      else{
        start = <h1 className="pleaseWait">Please wait while party leader starts the game</h1>;
      }

      let toRender = <Players session={this.props.session}/>;
      if ( this.state.state === 1 ) {
        toRender =(
          <GameSetup
            spotify={this.props.spotify_tokens}
            toLobby={this.toLobby.bind( this )}
            sessionID={this.props.sessionID}/>
        );
      }

      render = (
        <div>
          <BasicInfo session={this.props.session} changeState={this.props.changeState}/>
          {start}
          {toRender}
        </div>
      );
    }

    return (
      <div>{render}</div>
    );
  }
}

Game.propTypes = {
  status: PropTypes.number.isRequired, // 1: Create, 2: Join
  sessionID: PropTypes.number.isRequired,
  session: PropTypes.object,
  spotify_tokens: PropTypes.object.isRequired,
  changeState: PropTypes.func
};

export default withTracker( ( props ) => {
  Meteor.subscribe( "current-session" );
  return {
    session: Sessions.findOne( { id: props.sessionID } ),
    sessionID: props.sessionID,
  };
} )( Game );
