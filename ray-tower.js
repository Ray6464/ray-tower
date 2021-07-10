#!/usr/bin/env node

const { sucide, murder, homocide } = require('sucide');
const flags = require('ray-flags');
const path = require('path');

// Parsing and Utilizing Arguments Vector
const port = +flags.p | 5432; // port flag

const version = "v1.0.2";
const resourceDir = 'requestedResources';

if (flags.v) {sucide(version)}
else if (flags.init | false) {
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
else if (flags.pair | false) {
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
else if (flags.boot){

  // start coding here
  const express = require('express');
  const app = express();
  const fetch = require('node-fetch');
  const path = require('path');
  const fs = Object.assign({}, require('ray-fs'));
//  const hash = require('ray-hash'); // Use later for PGP

  fs.initDir(resourceDir); 

  const towerConfig = fs.readJSON('config.json').value;
  const pairedTowers = fs.readJSON('towers.json').value;

  app.get('/', (req, res)=>{ // Get tower info
    res.sendFile(path.join(process.cwd(), 'config.json'));
  });

  app.get('/request/:requestObject', (req, res)=>{ // Send Data to related towers
    const {breadCrumbs, requestedResource} = JSON.parse(req.params.requestObject);
    const requestedResourceURI = breadCrumbs[0] + '//' + breadCrumbs.slice(1).join('/');

    (async function() {
      let response = await fetch(requestedResourceURI);
      fs.stream(response.body, path.join(resourceDir,requestedResource));
    })();

    const responseObject = {
      requestStatus: "Your request is in Process.",
      accessTowerNode: "/fetch/" + requestedResourceURI
    }
    
    // status code 202 means request accepted for later processing since it will take time for a file to download.
    res.status(202).send(responseObject);
  });

  app.get('/fetch/:responseObject', (req, res)=>{ // Send Data to related towers 
    const responseObject = JSON.parse(req.params.responseObject);
    console.log(responseObject);
    const fileOnTower = path.join(resourceDir, responseObject.file);
    if (fs.exists(fileOnTower).value) {
      res.sendFile(path.join(process.cwd(), fileOnTower));
    } else {
      res.status(404);
    }
  });

  app.listen(towerConfig.TOWER_PORT);
}

