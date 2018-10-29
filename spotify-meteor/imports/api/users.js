import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

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
