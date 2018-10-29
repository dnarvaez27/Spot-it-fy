import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./TuneParameters.css";
import {Meteor} from "meteor/meteor";

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
  randomSample(arr,num){
    let b = JSON.parse(JSON.stringify(arr));
    let ans= [];
    for(let i=0;i<num;i++){
      const index = Math.floor(Math.random()*b.length);
      ans.push(b.splice(index,1)[0]);
    }
    return ans;
  }

  submitForm(){
    const locTracks = this.numTracks.current.value;
    const locDur = parseInt(this.durTracks.current.value);
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

          let tracks = this.randomSample(this.state.playlist.tracks.items,locTracks);
          let cleanTracks = [];
          for(let t of tracks){
            cleanTracks.push({uri: t.track.uri});
          }
          let playlist = 
                            { id:this.props.playlistID,
                              tracks:cleanTracks,
                              name: this.state.playlist.name};

          // console.log("sessionID: ",this.props.sessionID);
          // console.log("playlist: ",playlist);
          // console.log("locDur: ",locDur);

          Meteor.call( "session.config", this.props.sessionID, playlist,locDur,this.state.playlist.images[ 0 ].url,
            () => {
              console.log("session config updated succesfully.");
              this.props.toLobby();
            } );
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
              <p className="fixFuckup">PLAYLIST</p>
              <h1 className="fixFuckup">{this.state.playlist.name}</h1>
              <p className="fixFuckup">Tracks: {this.state.playlist.tracks.items.length}</p>
            </div>
          </div>

          
          <form className="configForm">
            <div className="labelContainer">
              <label className="fixFuckup">
                <h2 className="fixFuckup">
                  Number of tracks:
                </h2>
                <input className="coolInput" type="number" name="#ofTracks" ref={this.numTracks}/>
              </label>

              <label className="fixFuckup">
                <h2 className="fixFuckup">
                  Duration of each track (seconds):
                </h2>
                <input className="coolInput" type="number" name="durationOfTrack" ref={this.durTracks}/>
              </label>
              <br/>
              <br/>
              <div className="buttonDiv">
                <input className="playButton" onClick={this.submitForm.bind(this)} type="button" value="Save configurations" />
              </div>
            </div>
          </form>
          <br/>
          <br/>

        </div>
      );
    }
    

    return (toRender);
  }
}




TuneParameters.propTypes = {
  spotify: PropTypes.object.isRequired,
  playlistID : PropTypes.string.isRequired,
  toLobby: PropTypes.func.isRequired,
  sessionID: PropTypes.number.isRequired,
};
