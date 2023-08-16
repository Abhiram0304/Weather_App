const yourWeatherTab = document.querySelector("[yourWeatherTab]");
const searchWeatherTab = document.querySelector("[searchWeatherTab]");
const grantLocation = document.querySelector("[grantLocationContainer]");
const yourWeatherWindow = document.querySelector("[yourWeatherContainer]");
const searchWeatherWindow = document.querySelector("[searchWeatherContainer]");
const loadingWindow = document.querySelector("[loadingScreen]");

const API_KEY = 'eedfd7d6ad806f2135196662b6915211';
let currTab = yourWeatherTab;
currTab.classList.add("tabHighlight");

getFromSessionStorage();

function switchTabs(clickedTab){
    if(clickedTab != currTab){
        currTab.classList.remove("tabHighlight");
        currTab = clickedTab;
        currTab.classList.add("tabHighlight");

        if(!searchWeatherWindow.classList.contains("active")){
            yourWeatherWindow.classList.remove("active");
            grantLocation.classList.remove("active"); 
            searchWeatherWindow.classList.add("active");  
        }
        else{
            yourWeatherWindow.classList.remove("active");
            searchWeatherWindow.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

yourWeatherTab.addEventListener("click",() => switchTabs(yourWeatherTab));
searchWeatherTab.addEventListener("click",() => switchTabs(searchWeatherTab));

// Checking for Coordinates
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user_coordinates");

    // showing grant location container
    if(!localCoordinates){
        grantLocation.classList.add("active");
    }
    else{
        const Coordinates = JSON.parse(localCoordinates);
        fetchLocalWeatherInfo(Coordinates);
    }
}

async function fetchLocalWeatherInfo(Coordinates){
    const {lati,longi} = Coordinates;
    grantLocation.classList.remove("active");
    loadingWindow.classList.add("active");

    try{
        const localWeatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${API_KEY}&units=metric`);
        const data = await localWeatherData.json();
        loadingWindow.classList.remove("active");
        yourWeatherWindow.classList.add("active");
        renderUI(data);
    }
    catch(e){
        loadingWindow.classList.remove("active");
        alert("1");
    }
}

function renderUI(data){
    const placeName = document.querySelector("[placeName]");
    const countryIcon = document.querySelector("[countryIcon]");
    const weatherCondn = document.querySelector("[WtrCondn]");
    const weatherImage = document.querySelector("[wtrImg]");
    const temperature = document.querySelector("[tempData]");
    const maxTemperature = document.querySelector("[maxTemp]");
    const humidity = document.querySelector("[humidity]");
    const windSpeed = document.querySelector("[wSpeed]");
    const clouds = document.querySelector("[clouds]");
    const sunRise = document.querySelector("[sunRise]");
    const sunSet = document.querySelector("[sunSet]");

    console.log(data);
    placeName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherCondn.innerText = data?.weather?.[0]?.main;
    weatherImage.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText = data?.main?.temp + " °C";
    maxTemperature.innerText = data?.main?.temp_max + " °C";
    humidity.innerText = data?.main?.humidity + " %";
    windSpeed.innerText = data?.wind?.speed + " Km/s";
    clouds.innerText = data?.clouds?.all + " %";
    
    let sunRiseTime = parseInt(data?.sys?.sunrise);
    let s1 = new Date(sunRiseTime*1000);
    let h1 = s1.getHours();
    let m1 = "0" + s1.getMinutes();
    let sec1 ="0" + s1.getSeconds();
    let formattedTime1 = h1 + ':' + m1.substr(-2) + ':' + sec1.substr(-2);
    sunRise.innerText = formattedTime1;

    let sunSetTime = parseInt(data?.sys?.sunset);
    let s2 = new Date(sunSetTime*1000);
    let h2 = s2.getHours();
    let m2 = "0" + s2.getMinutes();
    let sec2 ="0" + s2.getSeconds();
    let formattedTime2 = h2 + ':' + m2.substr(-2) + ':' + sec2.substr(-2);
    sunSet.innerText = formattedTime2;

    yourWeatherWindow.classList.add("active");
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(myLocation);
    }
    else{
        alert("2");
    }
}

function myLocation(position){
    const myCoordinates = {
        lati : position.coords.latitude,
        longi : position.coords.longitude,
    }

    sessionStorage.setItem("user_coordinates",JSON.stringify(myCoordinates));
    fetchLocalWeatherInfo(myCoordinates);
}

const grantAccessBtn = document.querySelector("[btnGrantAccess]");
grantAccessBtn.addEventListener("click",getLocation);

const searchInput = document.querySelector("[searchInput]");
const searchBtn = document.querySelector("[searchBtn]")
searchBtn.addEventListener("click",(event) => {
    event.preventDefault();
    let placeName = searchInput.value;

    if(placeName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(placeName);    
    }
});

async function fetchSearchWeatherInfo(city){
    loadingWindow.classList.add("active");
    yourWeatherWindow.classList.remove("active");
    grantLocation.classList.remove("active");
    
    try{
        let searchWData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await searchWData.json();
        loadingWindow.classList.remove("active");
        yourWeatherTab.classList.add("active");
        // searchWeatherWindow.classList.add("active");
        renderUI(data);
    }
    catch(error){
        alert(error);
    }
}