import React, { Component } from "react";
import "./GameSetup.css";
import SelectPlaylist from "../SelectPlaylist/SelectPlaylist";
import PropTypes from "prop-types";
import TuneParameters from "../TuneParameters/TuneParameters";

export default class GameSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {playListSelected:false,playListId:undefined};
  }
  
  selectedPlaylist(playlistId){
    console.log(playlistId);
    this.setState({ playListSelected:true, playListId:playlistId});
  }

  render() {
    return (
      <div>
        {this.state.playListSelected?
          <TuneParameters spotify={this.props.spotify} playlistID={this.state.playListId}/>
          :
          <SelectPlaylist spotify={this.props.spotify} selectPlaylist={this.selectedPlaylist.bind(this)}/>
        }
      </div>
    );
  }
}


GameSetup.propTypes = {
  spotify: PropTypes.object.isRequired,
};
