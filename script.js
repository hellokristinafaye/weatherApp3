const apiKey = "2bd5559124f13def23addea6864b8f2c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
// These came from the Open Weather API website. I signed up for a free account that includes a unique API key and access to their URLs.  I think this is the same one from 2 years ago, so I don't think these expire.  But if they do, on their website it had a really easy generate button.  
// the URL is the weather search by city, but they have tons of options like by zip code or coordinates.  And then after the question mark are the parameters we wanna pass.  So one we want units to be metric, and at the end we leave 'q=' because of the later concatenation with the user's entered city.  


// these are how we access the HTML. so searchBox access the user input, searchBtn is the button, and weatherIcon is the weather icon that like, shows the current conditions
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// dark/light mode code 
var icon = document.getElementById("icon");

icon.onclick = function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        icon.src = "icons/sun.png";
    } else {
        icon.src = "icons/moon.png";
        
    }
}
// end dark/light mode code

// so the return button works inside the input box
document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
        event.preventDefault();
    }
})

// this function pulls the weather info based on user input, then displays the called weather info on the card.  Also changes the weather icon based on API response.
async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    // error message display in case the user inputs an invalid city.  it listens for a 404 error (which is the city being invalid) and if that's true then it alters the class list of the relevant elements. (wait. now I'm not sure if it's the class list or if that's actually altering its CSS property?? because it says style I think it's the attributes inside the element tag.  Not sure how important this disctinction is since both could work) Here it's the error message (.error) and the weather display (.weather). Block means it'll show up, none means it'll be hidden.  
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        // We're assigning the data from the weather API object to a variable called data. That line converts the API response into the json format (via the .json() method) and then assigns it to the data variable.
        var data = await response.json();
        
        console.log(data);
        // console.log(data.main);
        // console.log(data.main.humidity);

        // these are how we display the info from the weather API object.  we access the HTML element via querySelector and its class (".city, .temp, etc.").  innerHTML means the HTML content of that element, like the stuff between the 2 tags.    
        // Then we access the weather API object elements via dot notation like data.name and data.main.humidity.And then we concatenate the text with unit labels we're hard coded like "%" and "°c". And then that's what becomes the content between the two HTML tags and actually displays on the page. 
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        
        // weather icon 
        // here we use a conditional statement to decide which icon to display. We have a collection of images, most of which are named here.  we access the weather API object (assigned to the variable "data")and dot notation.  Then we check which one of these it matches.  The assets folder was based on the API's options directly, so we know it's gonna be one of them.  And then each option leverages the global variable weatherIcon, which allows us access to that spot on the page (via its class on the HTML side). It accesses the src attribute and then sets that to one of the filepaths of the icons. 
        // oh and in data.weather[0] we also use bracket notation to select this particular object element. I wonder why it's called 0?  Oh I guess it IS an array?? Weird. I wonder why?? It's all key value pairs, adn this one doesn't look much different? And it lists the array length too.  Not sure what that's about.  
        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        
        // These two lines dictate whether the card displays the weather report or the error message (or both if its' written wrong lol).  We access the window document (document), and the HTML element by its class (querySelector and then .weather or .error), it's style attribute, and then the display (CSS) property within that, and then assign it to value we want (block or none).
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        
    }
}

// search button functionality
// we access the button by the variable searchBtn (which leverages the element's class when we declared the variable) and add an event listener with (attEventListener), pass two parameters to it. The first parameter is is the event we wanna listen for (click) and the second parameter is the action we want to take whenever that event happens.  In this case it's an arrow function that calls the checkWeather function while passing some content into it.  That content is what the user inputs via input box, which we access via the searchBox variable adn its' property value (searchBox.value) 
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
})