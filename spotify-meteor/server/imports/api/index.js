import { Meteor } from 'meteor/meteor';
import express from 'express';
const querystring = require( "querystring" );
const request = require( "request" );
const cookieParser = require( "cookie-parser" );


const generateRandomString = function (length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export function setupApi() {
  const app = express();
  app.use( cookieParser() );

    const PORT = 3000;
    const URL = "https://spot-it-fy.herokuapp.com";
    const TOKEN_URL = "https://accounts.spotify.com/api/token";
    const CLIENT_ID = process.env.CLIENT_ID || "fd95c5089ee245fb9d1c4d5742ccfc2f";
    const CLIENT_SECRET = process.env.CLIENT_SECRET || "04e2e5e2b38d4335b4111881702c57a5";
    const REDIRECT_URL = URL + "/callback";
    const cookie_keys = {
    stateKey: "spotify_auth_state",
    access_token: "spotify_access_token",
    refresh_token: "spotify_refresh_token"
    };
    const SCOPE = [ "streaming", "user-read-birthdate", "user-read-email", "user-read-private", "user-modify-playback-state" ];


  app.get( "/login", ( req, res ) => {
    const state = generateRandomString( 16 );
    res.cookie( cookie_keys.stateKey, state );

    const url = "https://accounts.spotify.com/authorize?" +
      querystring.stringify( {
                               response_type: "code",
                               client_id: CLIENT_ID,
                               scope: SCOPE.join( " " ),
                               redirect_uri: REDIRECT_URL,
                               state: state
                             } );

    res.redirect( url );
  } );


  app.get( "/callback", ( req, res ) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[ cookie_keys.stateKey ] : null;

    // Check for CORS & external attack
    if ( state === null || state !== storedState ) {
      res.redirect( "/error?" +
                      querystring.stringify( {
                                               error: "state_mismatch"
                                             } ) );
    }
    else {
      res.clearCookie( cookie_keys.stateKey );
      const authOptions = {
        url: TOKEN_URL,
        form: {
          code: code,
          redirect_uri: REDIRECT_URL,
          grant_type: "authorization_code"
        },
        headers: {
          "Authorization": "Basic " + (new Buffer( CLIENT_ID + ":" + CLIENT_SECRET ).toString( "base64" ))
        },
        json: true
      };

      request.post( authOptions, ( error, response, body ) => {
        if ( !error && response.statusCode === 200 ) {
          const access_token = body.access_token;
          const refresh_token = body.refresh_token;
          const expire = body.expires_in * 1000;

          res.cookie( cookie_keys.access_token, access_token,  {maxAge : expire} );
          res.cookie( cookie_keys.refresh_token, refresh_token, {maxAge : expire} );
          res.redirect( URL );
        }
        else {
          res.redirect( "/error" +
                          querystring.stringify( {
                                                   error: "invalid_token"
                                                 } ) );
        }
      } );
    }

  } );


  app.get( "/refresh_token", ( req, res ) => {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
      url: TOKEN_URL,
      headers: {
        "Authorization": "Basic " + (new Buffer( CLIENT_ID + ":" + CLIENT_SECRET ).toString( "base64" ))
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token
      },
      json: true
    };

    request.post( authOptions, function ( error, response, body ) {
      if ( !error && response.statusCode === 200 ) {
        const access_token = body.access_token;
        const expire = body.expires_in * 1000;

        res.cookie( cookie_keys.access_token, access_token,  {maxAge : expire} );
        res.send( {
                    "access_token": access_token
                  } );
      }
      else {
        res.send( {
                    error,
                    response
                  } );
      }
    } );
  } );


  app.get( "/error", ( req, res ) => {
    res.send( {
                "error": req.query.error
              } );
  } );


  app.get("/stat", (req, res ) =>{
      res.send("Running");
  })

  WebApp.connectHandlers.use(app);
}
