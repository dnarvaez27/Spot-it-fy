import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
// import { check } from "meteor/check";
 
export const Playlists = new Mongo.Collection("playlists");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("playlists", function tasksPublication() {
    return Playlists.find();
  });
}
 
 