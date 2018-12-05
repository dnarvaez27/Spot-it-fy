import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import axios from "axios";
import AccountsUIWrapper from "./AccountsUIWrapper";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Session from "./session/Session";
import Modal from "./modal/Modal";
import { CookiesProvider } from "react-cookie";

export const BACKEND_URL = "https://spot-it-fy.herokuapp.com";

class App extends Component {

  constructor( props ) {
    super( props );
    this.playSongURI = this.playSongURI.bind( this );
    this.toggle = this.toggle.bind( this );
    this.openModal = this.openModal.bind( this );
    this.closeModal = this.closeModal.bind( this );
    this.errorModal = this.errorModal.bind( this );
    this.deviceID = undefined;
    this.played = false;
    this.modalRef = React.createRef();
    this.imgBannerRef = React.createRef();
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

  openModal( data, cbkc, onClose ) {
    this.modalRef.current.updateData( data, cbkc, onClose );
  }

  closeModal() {
    this.modalRef.current.closeModal();
  }

  errorModal( err ) {
    this.modalRef.current.showError( err );
  }

  render() {

    let content = (
      <div id="spotitfy-instructions-container">
        <div>
          <h1>How many songs can you identify?</h1>
          <span>Play it with your friends</span>
          <button>START</button>
        </div>
      </div>
    );

    if ( this.imgBannerRef.current ) {
      this.imgBannerRef.current.classList.remove( "banner-non-display" );
    }

    return (
      <div>
        <AccountsUIWrapper 
          openModal={this.openModal}
          closeModal={this.closeModal}
          showErrorModal={this.errorModal}/>
        <div id="spotitfy-img-container">
          <div id="spotitfy-img" ref={this.imgBannerRef}/>
        </div>
        {this.props.user
          ?
          <CookiesProvider>
            <Session imgBannerRef={this.imgBannerRef}
              openModal={this.openModal}
              closeModal={this.closeModal}
              showErrorModal={this.errorModal}/>
          </CookiesProvider>
          :
          content}
        <Modal ref={this.modalRef}/>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object
};

export default withTracker( () => {
  return {
    user: Meteor.user()
  };
} )( App );
