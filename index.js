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
var time = currentDate.getHours()+":"+currentDate.getMinutes()+":"+currentDate.getSeconds();

var origData = {
  "format": "png",
  "style": {
    "moonStyle": "default",
    "backgroundStyle": "stars",
      "backgroundColor": "blue",
      "headingColor": "black",
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

var bodiesData = {
  "latitude": "43.65348",
  "longitude": "-79.3839347",
  "elevation": "50",
  "fromDate": currentDate,
  "toDate": currentDate,
  "time": time
}

document.addEventListener('DOMContentLoaded', async function () {
  
  var moonTonight = document.querySelector("#tonight-moon");
  var moonBox1 = document.createElement("div");
  moonTonight.appendChild(moonBox1);
  moonBox1.classList.add("moonBox");
  await moonRequest(origData, moonBox1);
  
  //const userLocation = await getUserLocation();
  const dateOffsets = [1, 2, 3, 4, 5];
  
  // Load moon phases for each date offset in order
  for (const offset of dateOffsets) {
    const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + offset);
      origData.observer.date = currentDate.toISOString().split('T')[0];
      
      // Load moon phases for this date
      var moonForecast = document.querySelector("#moon-phase");
      var moonBox = document.createElement("div");
      moonForecast.appendChild(moonBox);
      moonBox.classList.add("moonBox");
      await moonRequest(origData, moonBox);
      
    }
});

// async function getUserLocation() {
//   return new Promise((resolve, reject) => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//           });
//         },
//         (error) => {
//           console.error('Error getting user location:', error);
//           reject(null);
//         }
//       );
//     } else {
//       console.error('Geolocation not supported by the browser');
//       reject(null);
//     }
//   });
// }

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
  event.preventDefault();
}

const appID = "96b04335-8a59-44f3-80ba-5f79d6b5bdb2";
const appSecret = "5fa633cf6abeb4329aeec9ac79b07f66e9c5ea082fcaff09ded32495f9ff10512aba0886f81c10bf5fe079c49ebb84590d9661437f5abcac83f9c102085e0e842b53dfa2531b0c75a4df71c307adafdf51e5bf532628459576f05438b93d40a27c85e0aaf2a83d2f559afd0a9d312297";
const authString = btoa(`${appID}:${appSecret}`);


const headers = new Headers({
  'Authorization': `Basic ${authString}`,
  'Content-Type': 'application/json',
});

async function moonRequest(data, container) {
  const apiUrl = 'https://api.astronomyapi.com/api/v2/studio/moon-phase';
  const fetchOptions = {
    method: 'POST', // HTTP method
    headers: headers,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(apiUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);
    let moonPic = document.createElement("img");
    moonPic.src = responseData.data.imageUrl;
    container.appendChild(moonPic);

  } catch (error) {
    console.error('Error:', error);
  }
}


