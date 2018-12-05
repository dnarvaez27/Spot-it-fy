import React, { Component } from "react";
import "./modal.css";

class Modal extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      title: undefined,
      body: undefined,
      foot: undefined,
      open: false,
      onClose: undefined,
      error: undefined
    };
    this.closeModal = this.closeModal.bind( this );
    this.showError = this.showError.bind( this );
  }

  updateData( data, cbck, onClose ) {
    this.setState( {
      title: data.title,
      body: data.body,
      foot: data.foot,
      open: true,
      onClose: onClose,
      error: undefined
    }, () => cbck && cbck() );
  }

  showError( err ) {
    this.setState( { error: err } );
  }

  closeModal() {
    if ( !(this.state.onClose && !this.state.onClose()) ) {
      this.setState( {
        title: undefined,
        body: undefined,
        foot: undefined,
        open: false,
        onClose: undefined,
        error: undefined
      } );
    }
  }

  render() {
    return (
      <div id="spotitfy-modal" className={this.state.open ? "" : "spotitfy-modal-hidden"}>
        <div>
          <div id="spotitfy-modal-header">
            {this.state.error && <div id="spotitfy-modal-error">{this.state.error}</div>}
            <h1>{this.state.title}</h1>
            <button onClick={this.closeModal}>&times;</button>
          </div>
          <div id="spotitfy-modal-body">
            {this.state.body}
          </div>
          <div id="spotitfy-modal-footer">
            {this.state.foot}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
