import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.publish("user.info", function(){
  return Meteor.users.find( this.userId,
    {fields: {_id:1, username:1, rToken: 1}}
  );
});

Meteor.methods( {
  "user.addRefreshToken"( id, rToken ) {
    check( id, String );
    check( rToken, String );

    Meteor.users.update(
      {_id: Meteor.userId()},
      { "$set": { rToken: rToken } }
    );
  }
} );
