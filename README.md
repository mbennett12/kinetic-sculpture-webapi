# kinetic-sculpture-webapi
Web API allowing students' kinetic sculptures to start simultaneously, for Barnard's COMS3930 Creative Embedded Systems

## Installation
Clone this repo, then:

```
cd kinetic-sculpture-webapi
npm install
```

## Running

```
node server.js
```

## Example usage (python)

```
>>> import requests
>>> should_i_run = requests.get('http://165.227.76.232:3000/myuni/running')
>>> print(should_i_run.json())
False
```
