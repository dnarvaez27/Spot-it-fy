import React, { Component } from "react";
import "./SelectPlaylist.css";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Playlists } from "../../../api/playlists.js";
import PropTypes from "prop-types";
import Playlist from "../Playlist/Playlist";
import axios from "axios";

// Renders all the available playlists
class SelectPlaylist extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      playlists: []
    };

    this.search = this.search.bind( this );
    this.searchChange = this.searchChange.bind( this );
    this.keyPressHandle = this.keyPressHandle.bind( this );
    this.searchInput = "";
  }

  search(){
    let query = this.searchInput;
    const url_info = `https://api.spotify.com/v1/search?q=${query}&type=playlist`;
    axios.get( url_info, { headers: { "Authorization": `Bearer ${this.props.spotify.access_token}` } } )
     .then( response => {
       let playlists= response.data["playlists"]["items"];
       playlists = playlists.map(p => {
         return {ID: p.id}
       });
       this.setState({playlists: playlists});
    } );
  }

  keyPressHandle(e){
    if(e.key === 'Enter'){
      this.search();
    }
  }

  searchChange(ev){
    if(ev.target.value === ''){
      this.setState({playlists: this.props.playlists});
    }
    else {
      this.searchInput = ev.target.value;
    }
  }

  componentDidMount() {
    this.setState({playlists: this.props.playlists});
  }

  render() {
    let plays = this.state.playlists;
    if(plays.length === 0){
      plays = this.props.playlists;
    }

    return (
      <div className='SelectPlaylist'>
        <h1 className="playlistsTitle">Please select a playlist</h1>
        <div id="search-container">
          <input placeholder="Search" onChange={this.searchChange} onKeyPress={this.keyPressHandle}/>
          <button onClick={this.search}><i className="fas fa-search"/></button>
        </div>
        <div className="playlistsContainer">
          {plays.map( playlist => {
            return (
              <Playlist
                key={playlist._id || playlist.ID}
                playlist={playlist}
                spotify={this.props.spotify}
                selectPlaylist={this.props.selectPlaylist}/>
            );
          } )}
        </div>
      </div>
    );
  }
}

export default withTracker( () => {
  Meteor.subscribe( "playlists" );

  return {
    playlists: Playlists.find( {} ).fetch(),
  };
} )( SelectPlaylist );

SelectPlaylist.propTypes = {
  playlists: PropTypes.array.isRequired,
  spotify: PropTypes.object.isRequired,
  selectPlaylist: PropTypes.func.isRequired,
};
