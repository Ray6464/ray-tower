# ray-tower
A NodeJS program to create a Ray-Net tower. A Ray-Tower is just a server that bounces the signal of a request to all paired towers in its network. This progect will eventually use PGP to encrypt communication. Also, a Ray-Tower keeps no records of the requests made through it! A Sharding protocol using "Slice-Net" will also be implemented!

# Installation
To install Ray-Tower use:
```
npm i ray-tower -g
```

# Configuration
To use a Ray-Tower we need to configure with a `config.json` file and a `towers.json` file.

To configure a `config.json` file use:
```
ray-tower -init -N "My Tower" -V "v1.2.3" -p 4001
```
Here you can replace "My Tower" with your tower name and "V1.2.3"' with your tower version. Keep updating your `config.json` file as you attach more and more towers to your tower.

It is recommanded to add a tower info to your `config.json` file.

To pair your tower with another tower use:
```
ray-tower -pair -N "new tower name" -ip 192.168.1.114 -p 4002
```
You can also display paired towers by using the `-public` flag in this command.

# Usage
Start your tower with:
```
ray-tower -boot
```
Now suppose that this tower is named "Ray-Tower 1" and it is listening at `192.168.1.114:3001` or `www.example-tower1.com`.
Similarly, suppose that another tower is running, named "Ray-Tower 2" and it is listening at `192.168.1.109:3002` or `www.example-tower2.com`.
Now, suppose that another server named "JohnDoe-VideoHost" is listening at `192.168.1.118:3030` or `www.exampleJohnDoe-VideoHost.com` and it has a video file available for download at URL `192.168.1.118:3030/file.mp4` or `www.exampleJohnDoe-VideoHost.com/file.mp4`.
Now, we can use another computer named "JaneDoe-desktop" to make a request at `192.168.1.118:3030/file.mp4`, bouncing the request off "Ray-Tower 1", and "Ray-Tower 2".
The request can `fetch` data from "JohnDoe-VideoHost", by passing it through a network of towers. For example:
```javascript
const fetch = require('node-fetch');
const fileName = 'file1.mp4';

const requestObject = {
  breadCrumbs: ['http:', 'localhost:3030', fileName],
  requestedResource: fileName,
}

fetch("http://192.168.1.114:3001/request/" + JSON.stringify(requestObject))
  .then( res => res.json())
  .then(json => {
    console.log(json);
  })
  .catch(err => {
    console.log(err);
  });
```
In this example we are making a request to the Ray-Tower at `192.168.1.114:3001` to fetch data from the URL `192.168.1.118:3030/file.mp4`, then make it available for download at `192.168.1.114:3001/fetch/192.168.1.118:3030/file.mp4`.
Once the Tower is done processing this request then we can use the following code to access it. The time it takes to process a request may vary. Once the file is available we can use the following code to download it form the Tower at `192.168.1.114:3001`.
```javascript
// This code runs on "JaneDoe-Desktop"
const fetch = require('node-fetch');
const fs = Object.assign({}, require('ray-fs'));
const {sucide} = require('sucide');

const fileName = 'file1.mp4';
const responseObject = {
  file: fileName,
}

fetch("http://192.168.1.114:3001/fetch/" + JSON.stringify(responseObject))
  .then((res) => {
    if (res.status != 404) return res.body;
    if (res.status == 404) sucide("Requested Resource not found!");
  })
  .then(body => {
    fs.stream(body, fileName);
  })
  .catch(err => {
    console.log(err);
  });
```
If "Ray-Tower 1" is paired to "Ray-Tower 2" then "Ray-Tower 1" will bounce the signal one more time, passing it through "Ray-Tower 2" before the fetch request eventually reaches "JohnDoe-VideoHost".

You can also use the "Ray-Fetch" utility from NPM to make requests to a Ray-Tower Instance from the command-line. Use `npm i -g ray-fetch`.

# LICENSE
MIT License

Copyright (c) 2021 Ray Voice

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


