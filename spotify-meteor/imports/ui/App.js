import React, { Component } from "react";
import "./App.css";
import { instanceOf } from "prop-types";
import { Cookies, withCookies } from "react-cookie";
import axios from "axios";
import AccountsUIWrapper from "./AccountsUIWrapper";
import GameSetup from "./GameSetup/GameSetup";

export const BACKEND_URL = "http://localhost:3000";

class App extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      spotify: {}
    };
    this.deviceID = undefined;
    this.playSongURI = this.playSongURI.bind( this );
    this.played = false;
    this.toggle = this.toggle.bind( this );
  }

  componentDidMount() {
    this.spotify = {
      access_token: this.props.cookies.get( "spotify_access_token" ),
      redirect_token: this.props.cookies.get( "spotify_refresh_token" )
    };
    if ( !this.spotify.access_token ) {
      window.open( `${BACKEND_URL}/login`, "_self" );
    }
    else {
      this.setState( { spotify: this.spotify } );
    }
    // setTimeout( () => {
    //   this.playSong();
    // }, 1000 );
  }

  playSong() {
    const player = new window.Spotify.Player( {
                                                name: "SpotifyGuessIt",
                                                getOAuthToken: cb => cb( this.spotify.access_token )
                                              } );
    player.addListener( "ready", ( { device_id } ) => {
      console.log( "Ready with Device ID", device_id );
      this.deviceID = device_id;
    } );

    // Connect to the player!
    player.connect()
          .then( success => {
            if ( success ) {
              console.log( "Connected successfully" );
            }
          } );
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

  render() {
    return (
      // <div>
      //   <AccountsUIWrapper/>
      //   <div id="spotitfy-img"/>
      //   <div id="spotitfy-instructions-container">
      //     <div>
      //       <h1>Select a playlist</h1>
      //     </div>
      //     <div>
      //       <h1>Play with your friends</h1>
      //     </div>
      //     <div>
      //       <h1>Guess the song</h1>
      //     </div>
      //   </div>
      // </div>
      <div>
        <GameSetup spotify={this.state.spotify}/>
      </div>
    );
  }
}

App.propTypes = {
  cookies: instanceOf( Cookies ).isRequired
};

export default withCookies( App );
