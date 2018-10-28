import React from "react";
import {Template} from "meteor/templating";
import {Blaze} from "meteor/blaze";

export default class AccountsUIWrapper extends React.Component{

  constructor( props ) {
    super( props );
    this.container = React.createRef();
  }

  componentDidMount(){
    this.view = Blaze.render(Template.loginButtons, this.container);
  }

  componentWillUnmount(){
    Blaze.remove(this.view);
  }

  render(){
    return <span ref={(ref) => this.container = ref}/>;
  }
}
