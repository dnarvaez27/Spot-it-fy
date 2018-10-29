import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

export const Sessions = new Mongo.Collection( "sessions" );

if ( Meteor.isServer ) {
  Meteor.publish( "sessions", function () {
    return Sessions.find( {} );
  } );
}

Meteor.methods( {
  "session.create"( id, user ) {
    check( id, Number );
    check( user, Object );

    const m_user = {};
    m_user[ user.username ] = { score: 0 };
    Sessions.insert( {
      id: id,
      createdAt: new Date(),
      users: m_user,
      config: {}
    } );
  },
  "session.join"( id, user ) {
    check( id, Number );
    check( user, Object );

    const temp = {};
    temp[ "users." + user.username ] = { score: 0 };
    Sessions.update(
      { id: id },
      { "$set": temp }
    );
  },
  "session.config"( id, playlist, duration ) {
    check( id, Number );
    check( playlist, Object );
    check( duration, Number );

    Sessions.update(
      { id: id },
      { "$set": { "config": { playlist, duration } } }
    );
  },
  "session.addPoint"( id, user ) {
    check( id, Number );
    check( user, Object );

    let up = {};
    up[ `users.${user.username}.score` ] = 1;
    Sessions.update(
      { id: id },
      { "$inc": up }
    );
  }
} );
