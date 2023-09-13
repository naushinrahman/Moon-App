// import fetch from 'node-fetch';

// const appID = "96b04335-8a59-44f3-80ba-5f79d6b5bdb2";
// const appSecret = "5fa633cf6abeb4329aeec9ac79b07f66e9c5ea082fcaff09ded32495f9ff10512aba0886f81c10bf5fe079c49ebb84590d9661437f5abcac83f9c102085e0e842b53dfa2531b0c75a4df71c307adafdf51e5bf532628459576f05438b93d40a27c85e0aaf2a83d2f559afd0a9d312297";
// const authString = Buffer.from(`${appID}:${appSecret}`).toString('base64');

// const headers = new Headers({
//   'Authorization': `Basic ${authString}`,
// });

// const apiUrl = 'https://api.astronomyapi.com/api/v2/';

// const fetchOptions = {
//   method: 'GET', // HTTP method 
//   headers: headers,
// };

// fetch(apiUrl, fetchOptions)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json(); // Parse the response as JSON
//   })
//   .then(data => {
    
//     console.log(data);
//   })
//   .catch(error => {
    
//     console.error('Error:', error);
//   });

let currentDate = new Date();

var origData = {
  "format": "png",
  "style": {
    "moonStyle": "default",
    "backgroundStyle": "stars",
      "backgroundColor": "blue",
      "headingColor": "white",
      "textColor": "white"
    },
    "observer": {
      "latitude": 43.65348,
      "longitude": -79.3839347,
      "date": currentDate
  },
  "view": {
    "type": "portrait-simple",
    "orientation": "north-up"
  }
}

function getLatLon() {
  const locationInput = document.getElementById('city').value;
  const APIKey = "e4875d42d4bb143769832d3c52da81bf";
  var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=${APIKey}`;

  async function getCoords() {
    try {
      const response = await axios.get(apiUrl);
      console.log(response);
      origData.observer.latitude = response.data[0].lat.toFixed(5);
      origData.observer.longitude = response.data[0].lon.toFixed(5);

    } catch (error) {
      console.error(error);
    }
  }
  getCoords();
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('moonForm');
  form.addEventListener('submit', handleSubmit);
});

function handleSubmit(event) {
  
  const dateInput = document.getElementById('date').value;
  
  // Create a data object with the user input
  origData.observer.date = dateInput;
  getLatLon();
  event.preventDefault();

  moonRequest(origData);
}

const appID = "96b04335-8a59-44f3-80ba-5f79d6b5bdb2";
const appSecret = "5fa633cf6abeb4329aeec9ac79b07f66e9c5ea082fcaff09ded32495f9ff10512aba0886f81c10bf5fe079c49ebb84590d9661437f5abcac83f9c102085e0e842b53dfa2531b0c75a4df71c307adafdf51e5bf532628459576f05438b93d40a27c85e0aaf2a83d2f559afd0a9d312297";
const authString = btoa(`${appID}:${appSecret}`);

const apiUrl = 'https://api.astronomyapi.com/api/v2/studio/moon-phase';

const headers = new Headers({
  'Authorization': `Basic ${authString}`,
  'Content-Type': 'application/json',
});

function moonRequest(data) {
  
  const fetchOptions = {
    method: 'POST', // HTTP method 
    headers: headers,
    body: JSON.stringify(data),
  };
  
  fetch(apiUrl, fetchOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the response as JSON
  })
  .then(data => {
    console.log(data);
    let moonpic = document.createElement("img");
    moonpic.src = data.data.imageUrl;
    var moonPhase = document.querySelector('#moon-phase');
    moonpic.style.width = '15rem';
    moonpic.style.height = '20rem';
    moonPhase.appendChild(moonpic);
    })
    .catch(error => {
      console.error('Error:', error);
    });   
}

function defaultMoons(data) {
  const today = new Date();

  const previous2 = new Date(today);
  previous2.setDate(previous2.getDate() - 2);
  origData.observer.date = previous2;
  moonRequest(data);

  const previous1 = new Date(today);
  previous1.setDate(previous1.getDate() - 1);
  origData.observer.date = previous1;
  moonRequest(data);

  origData.observer.date = today;
  moonRequest(data);

  const next1 = new Date(today);
  next1.setDate(next1.getDate() + 1);
  origData.observer.date = next1;
  moonRequest(data);

  const next2 = new Date(today);
  next2.setDate(next2.getDate() + 2);
  origData.observer.date = next2;
  moonRequest(data);
}

window.onload = defaultMoons(origData);