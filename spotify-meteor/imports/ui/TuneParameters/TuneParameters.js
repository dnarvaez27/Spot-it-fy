import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./TuneParameters.css";

const fields = "name,description,images,tracks.items(track(album,artists,duration_ms,id,name,uri))";

export default class TuneParameters extends Component {

  constructor(props) {
    super(props);
    this.state = {playlist:undefined};
    this.numTracks = React.createRef();
    this.durTracks = React.createRef();
  }
  

  componentDidMount() {
    const url_info = `https://api.spotify.com/v1/playlists/${this.props.playlistID}?fields=${fields}`;
    axios.get( url_info, { headers: { "Authorization": `Bearer ${this.props.spotify.access_token}` } } )
      .then( response => {
        this.setState( { playlist: response.data } );
      } );
  }

  submitForm(){
    const locTracks = this.numTracks.current.value;
    const locDur = this.durTracks.current.value;
    if(locTracks<=0){
      alert("The number of tracks must be positive.");
      
    }
    else{
      if(locTracks>this.state.playlist.tracks.items.length){
        alert("The number of tracks must be less than or equal than those of the playlist ("+this.state.playlist.tracks.items.length+" tracks).");
      }   
      else{
        if(locDur>30 || locDur<5){
          alert("The duration of the track must be between 5 and 30 seconds long.");
        }
        else{
          //START GAME
        }
      }
    }
  }

  render() {
    

    let toRender = (
      <div className="cssload-spin-box"></div>
    );

    if(this.state.playlist){
      console.log(this.state.playlist);
      console.log(this.state.playlist.tracks.items.length);
      toRender=(
        <div>

          <div className="playlistContainer">
            <img className="playlistImage" alt="playlist-cover" src={this.state.playlist.images[ 0 ].url}/>
            <div className="playlistDetails">
              <p>PLAYLIST</p>
              <h1>{this.state.playlist.name}</h1>
              <p>Tracks: {this.state.playlist.tracks.items.length}</p>
            </div>
          </div>

          
          <form className="configForm">
            <div className="labelContainer">
              <label >
                <h2>
                  Number of tracks:
                </h2>
                <input className="coolInput" type="number" name="#ofTracks" ref={this.numTracks}/>
              </label>

              <label type="number" >
                <h2>
                  Duration of each track (seconds):
                </h2>
                <input className="coolInput" type="number" name="durationOfTrack" ref={this.durTracks}/>
              </label>
              <br/>
              <br/>
              <div className="buttonDiv">
                <input className="playButton" onClick={this.submitForm.bind(this)} type="button" value="Play" />
              </div>
            </div>
          </form>

        </div>
      );
    }
    

    return (toRender);
  }
}




TuneParameters.propTypes = {
  spotify: PropTypes.object.isRequired,
  playlistID : PropTypes.string.isRequired,
};
