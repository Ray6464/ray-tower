#!/usr/bin/env node

const { sucide, murder, homocide } = require('sucide');
const flags = require('ray-flags');
// Parsing and Utilizing Arguments Vector
const port = +flags.p | 5432; // port flag
const init = flags.init | false;
const pairTower = flags.pair | false;

const version = "v0.0.1";

if (flags.v) {sucide(version)}
else if (init) {
  const fs = Object.assign({}, require('ray-fs'));
  if (flags.N == undefined) {sucide("Please provide the Name of the Tower!")}
  if (flags.V == undefined) {sucide("Please provide the Version of the Tower!")}
  if (flags.p == undefined) {sucide("Please provide the Port of the Tower!")}
  fs.writeJSON('config.json', {
    TOWER_NAME: flags.N,
    TOWER_VERSION: flags.V,
    TOWER_PORT: port,
    TOWER_TYPE: `ray-tower ${version}`,
    PUBLIC_TOWERS: [], // Towers you want other to see
  });
  fs.writeJSON('towers.json', { TOWER_NAME: flags.N, TOWER_VERSION: flags.V });
  sucide("Ray-Tower Initialized!");
}
else if (pairTower) {
  const fs = Object.assign({}, require('ray-fs'));
  const towerFile = 'towers.json';
  const configFile = 'config.json';
  homocide(flags.N, "Please provide the Name of the new Tower!");
  homocide(flags.ip,"Please provide the IP of the new Tower!");
  homocide(flags.p, "Please provide the IP of the new Tower!");
  const newTower = { name: flags.N, ip: flags.ip, port: flags.p }

  if (!fs.exists(towerFile).value) {sucide(`No ${towerFile} file exists!`)}
  function modJSON(json) {
    if (typeof(json) === undefined) {sucide(`${towerFile} is curropted!`)};
    if (json.towers === undefined) json.towers = [];
    json.towers.push({name: newTower.name, ip:newTower.ip, port: newTower.port});
    return json;
  }
  fs.updateJSON(towerFile, modJSON);
  if (flags.public | false) fs.updateJSON(configFile, modJSON);
  sucide("New Tower paired!");
}
else {

  // start coding here
  const express = require('express');
  const app = express();
  const fetch = require('node-fetch');
  const path = require('path');
  const fs = Object.assign({}, require('ray-fs'));

  app.get('/', (req, res)=>{
    res.sendFile(path.join(process.cwd(), 'config.json'));
  });

//const config = fs.readJSON(flags.c).value;

/* Sample config.json
  {
    name: "Anymans Tower Global",
    version: "v1.0.2"
  }
*/

app.listen(port);
}

