import React, { Component } from "react";
import BasicInfo from "../BasicInfo/BasicInfo";
import PropTypes from "prop-types";
import "./Spotitfy.css";
import axios from "axios";
import { randomSamples } from "../../setup/TuneParameters/TuneParameters";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Sessions } from "../../../api/sessions";
import { Leaderboard } from "../Leaderboard/Leaderboard";

function shuffle( a ) {
  for ( let i = a.length - 1; i > 0; i-- ) {
    const j = Math.floor( Math.random() * (i + 1) );
    [ a[ i ], a[ j ] ] = [ a[ j ], a[ i ] ];
  }
  return a;
}

class Spotitfy extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      currentTrack: props.curr_session.currentSong,
      options: [],
      actualTrack: undefined,
      disabled: false,
      loading: false
    };
    this.selectOption = this.selectOption.bind( this );
    this.timeout = undefined;
    this.stateTimeout = undefined;
  }

  componentDidMount() {
    this.next();
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.curr_session.currentSong !== this.props.curr_session.currentSong ) {
      this.next();
    }
  }

  componentWillUnmount(){
    this.timeout && clearTimeout(this.timeout);
  }

  playSongURI( uri, toggle = true, cbck ) {
    axios.put( `https://api.spotify.com/v1/me/player/${toggle ? "play" : "pause"}?device_id=${this.props.spotify_tokens.deviceID}`,
      {
        uris: [ uri ],
        position_ms: 30000 // Optional, start point
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.props.spotify_tokens.access_token}`
        }
      } )
      .then( () => {
        if ( cbck ) {
          cbck();
        }
      } );
  }

  next() {
    function songToString(t){
      let track = t.track.name;
      let artists = t.track.artists.map( a => a.name ).join( ", " );
      return `${track} - ${artists}`;
    }

    if ( this.state.currentTrack < this.props.curr_session.config.playlist.tracks.length ) {

      // Get correct song
      let origIndex = -1;
      const orig = this.props.fullPlaylist.tracks.items.filter( i => {
        if(i.track.uri === this.props.curr_session.config.playlist.tracks[ this.state.currentTrack ].uri){
          origIndex = i;
          return true;
        }
        return false;
      } )[ 0 ];

      let tempArray = JSON.parse(JSON.stringify(this.props.fullPlaylist.tracks.items));
      // Remove correct song from other possibilities
      tempArray.splice(origIndex, 1);
      // Get 4 random songs from array that does not contain correct song
      let opts = randomSamples( tempArray, 4 );
      // Push correct song
      opts.push( orig );
      // Map them to String
      opts = opts.map( songToString );
      // Shuffle the options
      opts = shuffle( opts );

      this.setState( { loading: true } );
      this.stateTimeout && clearTimeout( this.stateTimeout );
      this.stateTimeout = setTimeout(() =>{
        this.setState( { currentTrack: this.state.currentTrack + 1, options: opts, actualTrack: songToString(orig), disabled: false, loading: false },
          () => {
            this.timeout && clearTimeout(this.timeout);
            this.playSongURI( this.props.curr_session.config.playlist.tracks[ this.state.currentTrack - 1 ].uri, true,
              () => {
                this.timeout = setTimeout( () => {
                  Meteor.call( "session.nextSong", this.props.curr_session.id );
                }, (this.props.curr_session.config.duration + 3) * 1000 );
              } );
          } );
      },1500);
    }
    else {
      Meteor.call( "session.endGame", this.props.curr_session.id );
      this.playSongURI(undefined, false);
    }
  }

  selectOption( t ) {
    if ( t === this.state.actualTrack ) {
      Meteor.call( "session.addPoint", this.props.curr_session.id, Meteor.user() );
    }
    else {
      this.setState( { disabled: true } );
    }
  }

  render() {
    return (
      <div>
        <BasicInfo session={this.props.curr_session} changeState={this.props.changeState}/>
        <div className="gameBoard1">
          <div className="mainBoard">
            <h1 className="whiteAndCenter">
              {(this.props.curr_session.endOfGame && this.props.curr_session.currentSong > 1)
                ? "End of The Game" : "Guess the song"}</h1>
            {this.state.loading ? <div className="cssload-spin-box"/>:
              <div id="song-options-container">
                {this.state.options.map( ( e, i ) => {
                  return (
                    <button key={i} className={"song-option " + ((this.props.curr_session.endOfGame||this.state.disabled) ? "disabled " : " ")
                      + (this.state.disabled ?( e === this.state.actualTrack)? "song-item-ok" : "song-item-wrong": "")}
                    onClick={() => !this.props.curr_session.endOfGame && this.selectOption( e )}>
                      <h3>{e}</h3>
                    </button>
                  );
                } )}
              </div>
            }
          </div>
          <Leaderboard curr_session={this.props.curr_session}/>
        </div>
      </div>
    );
  }
}

Spotitfy.propTypes = {
  session: PropTypes.object.isRequired,
  spotify_tokens: PropTypes.object.isRequired,
  fullPlaylist: PropTypes.object.isRequired,
  curr_session: PropTypes.object,
  changeState: PropTypes.func
};


export default withTracker( ( props ) => {
  Meteor.subscribe( "sessions" );

  return {
    curr_session: Sessions.findOne( { "id": props.session.id } ),
  };
} )( Spotitfy );
