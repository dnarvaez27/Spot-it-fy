// Add Collections
import "../imports/api/sessions";
import "../imports/api/playlists";
import "../imports/api/users";
import { Meteor } from "meteor/meteor";
import { setupApi } from "./imports/api";

Meteor.startup(() => {
  setupApi(); // instantiate our new Express app
});
