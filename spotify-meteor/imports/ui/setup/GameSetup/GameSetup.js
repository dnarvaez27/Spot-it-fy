import React, { Component } from "react";
import "./GameSetup.css";
import SelectPlaylist from "../SelectPlaylist/SelectPlaylist";
import PropTypes from "prop-types";
import TuneParameters from "../TuneParameters/TuneParameters";

// Shows the setup of the session game. Shows either the selection of the playlist or the config variables to play
export default class GameSetup extends Component {
  constructor( props ) {
    super( props );
    this.state = { playListSelected: false, playListId: undefined };
  }

  selectedPlaylist( playlistId ) {
    this.setState( { playListSelected: true, playListId: playlistId } );
  }

  render() {
    let render = undefined;
    if(this.state.playListSelected){
      render = (
        <TuneParameters
          spotify={this.props.spotify}
          playlistID={this.state.playListId}
          toLobby={this.props.toLobby}
          sessionID={this.props.sessionID}/>
      );
    }
    else{
      render = (
        <SelectPlaylist spotify={this.props.spotify} selectPlaylist={this.selectedPlaylist.bind( this )}/>
      );
    }

    return (
      <div>{render}</div>
    );
  }
}


GameSetup.propTypes = {
  spotify: PropTypes.object.isRequired,
  toLobby: PropTypes.func.isRequired,
  sessionID: PropTypes.number.isRequired,
};
