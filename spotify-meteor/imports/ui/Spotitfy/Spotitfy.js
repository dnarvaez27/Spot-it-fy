import React, { Component } from "react";
import BasicInfo from "../BasicInfo/BasicInfo";
import PropTypes from "prop-types";
import "./Spotitfy.css";
import axios from "axios";

export default class Spotitfy extends Component {

  
  playSongURI( uri ) {
    axios.put( `https://api.spotify.com/v1/me/player/play?device_id=${this.props.spotify_tokens.deviceID}`,
      {
        uris: [ uri ],
        position_ms: 0 // Optional, start point
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.props.spotify_tokens.access_token}`
        }
      } )
      .then( () => {
        this.played = true;
      } );
  }

  componentDidMount(){
    this.playSongURI(this.props.session.config.playlist.tracks[0].uri);
  }

  // getSnapshotBeforeUpdate(prevProps, prevState){
    
  // }

  render() {
    return (
      <div>
        <BasicInfo session={this.props.session}/>
        <div className="gameBoard1">
          <div className="mainBoard">
            <h1 className="whiteAndCenter">Guess the song</h1>
          </div>
          <div className="leaderBoard">
            <h2 className="whiteAndCenter">Leaderboard</h2>
            {Object.keys(this.props.session.users).map(user=>{
              return <div className="whiteAndCenter" key={user}>{user}: {this.props.session.users[user].score}</div>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

Spotitfy.propTypes = {
  session : PropTypes.object.isRequired,
  spotify_tokens : PropTypes.object.isRequired,
};
