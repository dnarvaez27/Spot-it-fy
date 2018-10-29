# Spot-it-fy

A multiplayer game where the players have to guess the title of the song based on its audio. The player that guesses the song in the shortest amount of time wins a point. The player who has the most points at the end of the playlist, wins. 

---
## Used technologies

- Spotify API

  - [Main API Library (spotify)](https://developer.spotify.com/documentation/web-api/reference/)  
  - [Web Playback SDK (spotify)](https://developer.spotify.com/documentation/web-playback-sdk/reference/)
- Meteor
- React
- Node
- Axios



---
## How to run

Small backend in Express runs in localhost:3000  
Frontend and main backend runs in localhost:3001

To run backend: 

```
cd spotify-node
npm install 
node index.js
```

To run front end and populate database:

```
cd spotify-meteor
meteor npm install 
meteor --port 3001
cd data/
./uploadPlaylistsToMongo.sh
```
---
## Authors


[Mauricio Neira](https://mneira10.github.io/ "me") - 201424001

[David Narvaez](https://dnarvaez27.github.io/ "my buddy") - 201516897

## Licence

This project is licensed under the MIT license. For more information, visit [./LICENSE](https://github.com/dnarvaez27/Spot-it-fy/blob/master/LICENSE) at this repo. 
