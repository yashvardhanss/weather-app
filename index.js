const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


//initially variables needed?

let currentTab = userTab;      //by default user ka weather dikhaega
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();


// tabs switching  --- color shifting
function switchTab(clickedTab){
  //ye dikha ra hai ki konse tab pe hai
  if(clickedTab != currentTab){    // jab dono ek dusre ke equla na ho tab hi switch krenge
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
      //ye user info grant access ko hide krra hai
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");

      //ye search wale tab ko visible kra ra hai
      searchForm.classList.add("active");
    }
    else{
      //mai pehle searchWeather wale tab pe tha , but ab yourWeather wala tab VISIBLE krna hai
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab mai your weather wale tab me aagya hu, to weather bhi display krna padega, so let's check local storage first
      //for coordinates, if we have saved them there.
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
  //pass clicked tab as input parameter
  switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    //agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  }
  else{
    //agar local coordinates pade hue hai
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}


async function fetchUserWeatherInfo(coordinates){
  const {lat, lon} = coordinates;
  //make grant container invisible
  grantAccessContainer.classList.remove("active");
  //make loader viible
  loadingScreen.classList.add("active");

  //API CALL
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data)
  }
  catch(err){
    loadingScreen.classList.remove("active");
    //hw
  }
}


function renderWeatherInfo(weatherInfo){
  //first we have to fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDescription");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherInfo object and put in UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    //HW - show an alert for no gelolocation support available
  }
}

function showPosition(position){
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

//search from me jab bhi submit button dabau to kuch hona chahiye
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) =>{
  e.preventDefault();
  let cityName = searchInput.value;
  if(cityName === "")
     return;
  else{
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
    //hw
  }
}