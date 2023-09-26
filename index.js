let currentDate = new Date();

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

document.addEventListener('DOMContentLoaded', async function () {
  
  const form = document.getElementById('moonForm');
  form.addEventListener('submit', handleSubmit);
  //const userLocation = await getUserLocation();

  // Update the observer parameters with the user's location
  // origData.observer.latitude = userLocation.latitude.toFixed(5);
  // origData.observer.longitude = userLocation.longitude.toFixed(5);

  var moonTonight = document.querySelector("#tonight-moon");
  var moonBox1 = document.createElement("div");
  moonTonight.appendChild(moonBox1);
  moonBox1.classList.add("moonBox");
  await moonRequest(origData, moonBox1);
  
  await next5Nights(currentDate);
    }
);

// function getUserLocation() {
//   return new Promise((resolve, reject) => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const latitude = position.coords.latitude;
//           const longitude = position.coords.longitude;
//           resolve({ latitude, longitude });
//         },
//         (error) => {
//           reject(error);
//         }
//       );
//     } else {
//       reject(new Error("Geolocation is not available in this browser."));
//     }
//   });
// }

async function next5Nights(date) {
  const dateOffsets = [1, 2, 3, 4, 5];
  
  const currentDate = new Date(date);
  // Load moon phases for each date offset in order
  for (const offset of dateOffsets) {
    const nextDate = new Date(currentDate);
    
    // Calculate the next date by adding the offset
    nextDate.setDate(nextDate.getDate() + offset);

    // Update the observer's date in origData
    origData.observer.date = nextDate.toISOString().split('T')[0];
      
      // Load moon phases for this date
      var moonForecast = document.querySelector("#moon-phase");
      var moonBox = document.createElement("div");
      moonForecast.appendChild(moonBox);
      moonBox.classList.add("moonBox");

    await moonRequest(origData, moonBox);
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

      const latitude = parseFloat(response.data[0].lat);
      const longitude = parseFloat(response.data[0].lon);

      origData.observer.latitude = latitude;
      origData.observer.longitude = longitude;


    } catch (error) {
      console.error(error);
    }
  }
  getCoords();
}

function updateObserverDate(date) {
  origData.observer.date = date;
}

function handleSubmit(event) {
  event.preventDefault();
  const dateInput = document.getElementById('date').value; 
  updateObserverDate(dateInput); 
  resetMoonDisplay(); 
  getLatLon();

  var moonTonight = document.querySelector("#tonight-moon");
  var moonBox1 = document.createElement("div");
  moonTonight.appendChild(moonBox1);
  moonBox1.classList.add("moonBox");
  moonRequest(origData, moonBox1);
  next5Nights(dateInput);
}

function resetMoonDisplay() {
  const moonPhaseContainer = document.querySelector('#moon-phase');
  const moon1 = document.querySelector('#tonight-moon')
  while (moonPhaseContainer.firstChild) {
    moonPhaseContainer.removeChild(moonPhaseContainer.firstChild);
  }
  while (moon1.firstChild) {
    moon1.removeChild(moon1.firstChild);
  }
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
