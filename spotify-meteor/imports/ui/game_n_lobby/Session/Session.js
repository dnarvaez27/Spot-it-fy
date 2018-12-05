import React, { Component } from "react";
import PropTypes, { instanceOf } from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import "./Session.css";
import Game from "../Game/Game";
import { Cookies, withCookies } from "react-cookie";
import { BACKEND_URL } from "../../App";
import SelectGame from "../SelectGame/SelectGame";

class Session extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      state: 0, // 0: choice, 1: create, 2: join,
      sessionID: 0,
      spotify_tokens: {}
    };
    this.changeState = this.changeState.bind( this );
    this.updateSession = this.updateSession.bind( this );
  }

  componentDidMount() {
    let spotify = {
      access_token: this.props.cookies.get( "spotify_access_token" ),
      redirect_token: this.props.cookies.get( "spotify_refresh_token" )
    };
    if ( !spotify.access_token ) {
      const goToAuth = () => {
        window.open( `${BACKEND_URL}/login`, "_self" );
      };
      this.props.openModal( {
        title: "Authorize us to use Spotify",
        body: (
          <div id="auth-modal-body-container">
            <h2>In order to use this app you must authorize it.</h2>
            <b>You must have a Premium account in Spotify</b>
            <span>You will be redirected to Spotify</span>
          </div>
        ),
        foot: (
          <div id="auth-modal-foot-container">
            <button onClick={goToAuth}>Authorize</button>
          </div>
        )
      }, undefined, () => false );
    }
    else {
      Meteor.call( "user.addRefreshToken", this.props.user._id, spotify.redirect_token );
      this.setState( { spotify_tokens: spotify }, () => {
        setTimeout( () => {
          this.initPlayer();
        }, 1000 );
      } );
    }
  }

  initPlayer() {
    const player = new window.Spotify.Player( {
      name: "Spot-it-fy",
      getOAuthToken: cb => cb( this.state.spotify_tokens.access_token )
    } );

    player.addListener( "ready", ( { device_id } ) => {
      console.log( "Player ready with device ID", device_id );
      this.deviceID = device_id;
      let spotify_tokens = this.state.spotify_tokens;
      spotify_tokens.deviceID = device_id;
      this.setState( { spotify_tokens } );
    } );

    // Connect to the player!
    player.connect()
      .then( success => {
        if ( success ) {
          console.log( "Player connected successfully" );
        }
      } );
  }

  changeState(num){
    this.props.imgBannerRef.current.classList.remove( "banner-non-display" );
    this.setState({state: num});
  }

  updateSession(state, sessionID){
    this.setState( { state: state, sessionID: sessionID} );
  }

  render() {
    let status = undefined;

    if ( this.state.state === 0 ) {
      status = (
        <SelectGame
          openModal={this.props.openModal}
          closeModal={this.props.closeModal}
          showErrorModal={this.props.showErrorModal}
          updateSession={this.updateSession}/>
      );
    }
    else {
      this.props.imgBannerRef.current.classList.add( "banner-non-display" );
      status = (
        <Game
          spotify_tokens={this.state.spotify_tokens}
          status={this.state.state}
          sessionID={this.state.sessionID}
          changeState={this.changeState}/>
      );
    }

    return (
      <div>{status}</div>
    );
  }
}

export default withTracker( () => {
  Meteor.subscribe( "sessions" );
  Meteor.subscribe( "user.info" );

  return {
    user: Meteor.user()
  };
} )( withCookies( Session ) );

Session.propTypes = {
  cookies: instanceOf( Cookies ).isRequired,
  user: PropTypes.object,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  showErrorModal: PropTypes.func,
  imgBannerRef: PropTypes.object
};
