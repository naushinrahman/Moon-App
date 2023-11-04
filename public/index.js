const currentDate = new Date();

var moonData = {
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

var starData =  {
    "observer": {
      "latitude": 43.65348,
      "longitude": -79.3839347,
      "date": currentDate
    },
    "view": {
        "type": "area",
        "parameters": {
            "position": {
                "equatorial": {
                    "rightAscension": 14.83,
                    "declination": -15.23
                }
            },
            "zoom": 3 
        }
    }
}

document.addEventListener('DOMContentLoaded', async function () {
  
  const form = document.getElementById('moonForm');
  form.addEventListener('submit', handleSubmit);

  var moonTonight = document.querySelector("#tonight-moon");
  var moonBox1 = document.createElement("div");
  moonTonight.appendChild(moonBox1);
  moonBox1.classList.add("moonBox");
  await moonRequest(moonData, moonBox1);
  
  await next4Nights();

  var starTonight = document.querySelector("#tonight-star");
  var starContainer = document.createElement("div");
  starTonight.appendChild(starContainer);
  starContainer.classList.add("starContainer");
  await starRequest(starData, starContainer);
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

async function next4Nights() {
  const dateOffsets = [1, 2, 3, 4];
  const currentDate = new Date();

  for (const offset of dateOffsets) {
    const nextDate = new Date(currentDate);
    
    nextDate.setDate(nextDate.getDate() + offset);

    moonData.observer.date = nextDate.toISOString().split('T')[0];
      
      var moonForecast = document.querySelector("#moon-phase");
      var moonBox = document.createElement("div");
      moonForecast.appendChild(moonBox);
      moonBox.classList.add("moonBox");

    await moonRequest(moonData, moonBox);
  }
}

async function getLatLon(data) {
  const locationInput = document.getElementById('city').value;
  const APIKey = "e4875d42d4bb143769832d3c52da81bf";
  var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=${APIKey}`;

    try {
      const response = await axios.get(apiUrl);
      console.log(response);

      const latitude = parseFloat(response.data[0].lat);
      const longitude = parseFloat(response.data[0].lon);

      data.observer.latitude = latitude;
      data.observer.longitude = longitude;

    } catch (error) {
      console.error(error);
    }
}


async function handleSubmit(event) {
  event.preventDefault();
  resetMoonDisplay(); 
  resetStarChart();

  moonData.observer.date = currentDate;
  starData.observer.date = currentDate;
 
  console.log(starData.observer.latitude);
  await getLatLon(moonData);
  await getLatLon(starData);
  console.log(starData.observer.latitude);

  var moonTonight = document.querySelector("#tonight-moon");
  var moonBox = document.createElement("div");
  moonTonight.appendChild(moonBox);
  moonBox.classList.add("moonBox");
  moonRequest(moonData, moonBox);

  next4Nights();

  var starTonight = document.querySelector("#tonight-star");
  var starContainer = document.createElement("div");
  starTonight.appendChild(starContainer);
  starContainer.classList.add("starContainer");
  starRequest(starData, starContainer);  

}

function resetMoonDisplay() {
  const moonPhaseContainer = document.querySelector('#moon-phase');
  const moon = document.querySelector('#tonight-moon')
  while (moonPhaseContainer.firstChild) {
    moonPhaseContainer.removeChild(moonPhaseContainer.firstChild);
  }
  while (moon.firstChild) {
    moon.removeChild(moon.firstChild);
  }
}

function resetStarChart() {
  const star = document.querySelector('#tonight-star');
  while (star.firstChild) {
    star.removeChild(star.firstChild);
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
    method: 'POST', 
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

async function starRequest(data,container) {
  const apiURL = 'https://api.astronomyapi.com/api/v2/studio/star-chart';
  const fetchOptions = {
    method: 'POST', 
    headers: headers,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(apiURL, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    let starPic = document.createElement("img");
    starPic.src = responseData.data.imageUrl;
    container.appendChild(starPic);

  } catch (error) {
    console.error('Error:', error);
  }
}