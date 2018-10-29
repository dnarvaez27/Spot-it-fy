import React, { Component } from "react";
import PropTypes, { instanceOf } from "prop-types";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../api/sessions";
import "./Session.css";
import Game from "../game/Game";
import { Cookies, withCookies } from "react-cookie";
// import axios from "axios";
import { BACKEND_URL } from "../App";

class Session extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      state: 0, // 0: choice, 1: create, 2: join,
      sessionID: 0,
      spotify_tokens: {}
    };
    this.createSession = this.createSession.bind( this );
    this.joinSession = this.joinSession.bind( this );
    this.changeState = this.changeState.bind( this );
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
      // setTimeout(() =>{
      //   axios.get(`${BACKEND_URL}/refresh_token?refresh_token=${this.props.user.rToken}`)
      //     .then( response => {
      //       let spotify_tokens = this.state.spotify_tokens;
      //       console.log(spotify_tokens);
      //       spotify_tokens["access_token"] = response.data.access_token;
      //       console.log(spotify_tokens);
      //       this.setState( { spotify_tokens } );
      //     })
      //     .catch(() => {
      //       console.log("error en el Token");
      //
      //     });
      // }, 1000);
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
      name: "SpotifyGuessIt",
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

  createSession() {
    let curSession = this.props.sessions;
    curSession = isNaN( curSession ) ? 1 : curSession + 1;
    Meteor.call( "session.create", curSession, this.props.user,
      () => {
        this.setState( { state: 1, sessionID: curSession } );
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
            self.setState( { state: 2, sessionID: sessionID } );
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
          <input type="number" min="1" placeholder="Session ID" onChange={handleChange}
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

  changeState(num){
    this.props.imgBannerRef.current.classList.remove( "banner-non-display" );
    this.setState({state: num});
  }

  render() {
    let status = undefined;

    if ( this.state.state === 0 ) {
      status = (
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
      <div>
        {status}
      </div>
    );
  }
}

export default withTracker( () => {
  Meteor.subscribe( "sessions" );
  Meteor.subscribe( "user.info" );

  return {
    sessions: Sessions.find( {} ).count(),
    user: Meteor.user()
  };
} )( withCookies( Session ) );

Session.propTypes = {
  cookies: instanceOf( Cookies ).isRequired,
  user: PropTypes.object,
  sessions: PropTypes.number,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  showErrorModal: PropTypes.func,
  imgBannerRef: PropTypes.object
};
