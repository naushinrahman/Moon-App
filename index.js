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


var postData = {
  "format": "png",
  "style": {
    "moonStyle": "default",
    "backgroundStyle": "stars",
      "backgroundColor": "blue",
      "headingColor": "white",
      "textColor": "white"
    },
    "observer": {
      "latitude": 6.56774,
      "longitude": 79.88956,
      "date": "2020-09-11"
  },
  "view": {
    "type": "landscape-simple",
    "orientation": "north-up"
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('moonForm');
  form.addEventListener('submit', handleSubmit);
});

function handleSubmit(event) {
  
  const dateInput = document.getElementById('date').value;
  const locationInput = document.getElementById('city').value;
  
  'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}'
  
  // Create a data object with the user input
  postData.observer.date = dateInput;

  event.preventDefault();

  APIRequest(postData);
}

function APIRequest(data) {
  const appID = "96b04335-8a59-44f3-80ba-5f79d6b5bdb2";
  const appSecret = "5fa633cf6abeb4329aeec9ac79b07f66e9c5ea082fcaff09ded32495f9ff10512aba0886f81c10bf5fe079c49ebb84590d9661437f5abcac83f9c102085e0e842b53dfa2531b0c75a4df71c307adafdf51e5bf532628459576f05438b93d40a27c85e0aaf2a83d2f559afd0a9d312297";
  const authString = btoa(`${appID}:${appSecret}`);
  
  const headers = new Headers({
    'Authorization': `Basic ${authString}`,
    'Content-Type': 'application/json',
  });
  
  const apiUrl = 'https://api.astronomyapi.com/api/v2/studio/moon-phase';
  
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
    moonPhase.appendChild(moonpic);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
