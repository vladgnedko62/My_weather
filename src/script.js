'use strict';

// CurrentWeather = @"https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+wApi+"&units=metric";
// 5dayWeather=api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+wApi+"&units=metric";
// nearby https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
class Weather {

    init() {
        this.infoItems = document.querySelector('.infoItems');
        this.pageNotFoundHtml = " <img src='./404.png' style='height: 500px;' alt=''>";
        this.today = true;
        this.wApi = "db868b6ad58cac2c774ca64a6592c667";
        let inp = document.querySelector('.fa-search');
        this.hourlyList=new Array();
inp.addEventListener('click',  (event)=> {
    let value = document.querySelector("[type='search']").value;
    this.setPageWeather(value); 
});
    document.querySelectorAll('li').forEach((el) => {
        el.addEventListener('click',  (ev)=> {
           this.defaultLi();
            ev.target.setAttribute('class', "selected");
            let val = document.querySelector("[type='search']").value;
            if (ev.target.innerText == "Today") {
                this.today = true;
                if (val != null) {
                    this.setPageWeather(val);
                }
    
            } else {
                this.today = false;
                if (val != null) {
                    this.setPageWeather(val);
                }
            }
        });
    });

    }
    pageNotFound() {
        this.infoItems.innerHTML = this.pageNotFoundHtml;
    }
    setPageWeather(cityName) {
        if (this.today) {
            this.urlToday(cityName);
        } else {
            this.url5d(cityName);
        }
    }
    url5d(cityName) {
        // console.log("OK: "+cityName);
        let url1 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + this.wApi + "&units=metric";
        this.get5dJson(url1);
    }
    get5dJson(url) {
        let oReq = new XMLHttpRequest();
        oReq.onload = (el) => { this.set5dWeather(el) };
        oReq.open("get", url, true);
        oReq.send();
    }
    set5dWeather(json) {
        let obj = JSON.parse(json.target.response);
        console.log(obj);
        if (obj.cod == 404) {
            this.infoItems.innerHTML = " <img src='./404.png' style='height: 500px;' alt=''>";
            return;
        }
        let hourlyObj;
        let day = new Date(obj.list[0].dt_txt);
        let str;
        str = `<div class="infoItem days">

`
        let i = 1;
        let currentEl = "1";
        let elF="";
        this.hourlyList=obj;
        obj.list.forEach((el) => {
            day=new Date(el.dt_txt);
            console.log( day.toDateString());
            if (elF != day.toDateString().split(' ')[2]) {
                elF=day.toDateString().split(' ')[2];
                currentEl = day.toDateString();
            } else {
                return;
            }
            let imgPath;
            let weather=el.weather[0].main;
            switch (weather) {
                case "Clouds": imgPath = "./clouds.png"; break;
                case "Clear": if (date => 18 && date < 6) { imgPath = "./moon.png" }
                else { imgPath = "./sun.png" } break;
                case "Rain": imgPath = "./rain.png"; break;
            }
            let elem = `<div class="day" id="${currentEl.split(' ')[0]}">
    <div class="dayName">${currentEl.split(' ')[0]}</div>
    <div class="monName">${currentEl.split(' ')[1] + " " + currentEl.split(' ')[2]}</div>
    <div class="image"><img src="${imgPath}" style="height:83px ;" alt=""></div>
    <div class="temp">${el.main.temp} C</div>
    <div class="weather">${weather}</div>
</div>`;
i++;
str+=elem;
        });
        str+=`</div>`
        this.infoItems.innerHTML="";
        this.infoItems.insertAdjacentHTML('beforeend',str);
        document.querySelectorAll(".day").forEach((el) => {
            el.addEventListener('click',  (ev)=> {
               this.defaultD();
                let target=ev.target;
                if(target.getAttribute('class')=='day'){
                    target.setAttribute('class', "day selectedD");
                }else{
                    return;
                }
                this.setHourlyFromDay(target.id);
            });
        });
    }
    getJsonCurrent(url) {
        let oReq = new XMLHttpRequest();
        oReq.onload = (el) => { this.setCurrentWeather(el) };
        oReq.open("get", url, true);
        oReq.send();
    }
    getJsonHourly(url) {
        let oReq = new XMLHttpRequest();
        oReq.onload = (el) => { this.setHourlyWeather(el) };
        oReq.open("get", url, true);
        oReq.send();
    }
    getJsonNearby(url) {
        let oReq = new XMLHttpRequest();
        oReq.onload = (el) => { this.setNearbyWeather(el) };
        oReq.open("get", url, true);
        oReq.send();
    }
    urlToday(cityName) {
        let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + this.wApi + "&units=metric";
        this.getJsonCurrent(url);
        let url1 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + this.wApi + "&units=metric";
        this.getJsonHourly(url1);
        this.getJsonNearby(url);
    }
    setNearbyWeather(json) {
        let obj = JSON.parse(json.target.response);
        if (obj.cod == 404) {
            this.infoItems.innerHTML = " <img src='./404.png' style='height: 500px;' alt=''>";
            return;
        }
        this.infoItems.insertAdjacentHTML('beforeend', `<div class="infoItem nearby">
        <div class="headerN">
            <div class="titleN">
               NEARBY PLACES
            </div>
            <div class="elements">
                <div class="first">
                    <div class="f1">
                        <!-- <div class="cityName">Dubai</div><div class="image"><img src="./sun.png" style="height: 20px;" alt=""></div><div class="temp">36 C</div> -->
                    </div>
                    <div class="f2">
                        <!-- <div class="cityName">Dubai</div><div class="image"><img src="../sun.png" style="height: 20px;" alt=""></div><div class="temp">36 C</div> -->
                    </div>
                </div>
                <div class="seccond">
                    <div class="f1">
                        <!-- <div class="cityName">Dubai</div><div class="image"><img src="../sun.png" style="height: 20px;" alt=""></div><div class="temp">36 C</div> -->
                    </div>
                    <div class="f2">
                        <!-- <div class="cityName">Dubai</div><div class="image"><img src="../sun.png" style="height: 20px;" alt=""></div><div class="temp">36 C</div> -->
                    </div>
                </div>
            </div>
    </div> 
    </div> `);
        this.infoItems.insertAdjacentText
        let lat = parseFloat(obj.coord.lat), lon = parseFloat(obj.coord.lon);
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat - 1}&lon=${lon - 1}&appid=${this.wApi}&units=metric`
        let oReq1 = new XMLHttpRequest();
        oReq1.onload = (el) => { this.nb1(el) };
        oReq1.open("get", url, true);
        oReq1.send();
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat - 1}&lon=${lon + 1}&appid=${this.wApi}&units=metric`
        let oReq2 = new XMLHttpRequest();
        oReq2.onload = (el) => { this.nb2(el) };
        oReq2.open("get", url, true);
        oReq2.send();
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat + 1}&lon=${lon - 1}&appid=${this.wApi}&units=metric`
        let oReq3 = new XMLHttpRequest();
        oReq3.onload = (el) => { this.nb3(el) };
        oReq3.open("get", url, true);
        oReq3.send();
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat + 1}&lon=${lon + 1}&appid=${this.wApi}&units=metric`
        let oReq4 = new XMLHttpRequest();
        oReq4.onload = (el) => { this.nb4(el) };
        oReq4.open("get", url, true);
        oReq4.send();
    }
    nb1(json) {
        let obj = JSON.parse(json.target.response);
        let f_f1 = this.infoItems.querySelector(".nearby").querySelector('.first').querySelector('.f1');
        console.log(f_f1);
        let name = obj.name;
        let weather = obj.weather[0].main;
        let temp = obj.main.temp;
        let imgPath;
        let str;

        switch (weather) {
            case "Clouds": imgPath = "./clouds.png"; break;
            case "Clear": if (date => 18 && date < 6) { imgPath = "../images/moon.png" }
            else { imgPath = "./sun.png" } break;
            case "Rain": imgPath = "./rain.png"; break;
        }
        str = `<div class="cityName">${name}</div><div class="image"><img src="${imgPath}" style="height: 20px;" alt=""></div><div class="temp">${temp} C</div>`
        f_f1.insertAdjacentHTML('beforeend', str);
    }
    nb2(json) {
        let obj = JSON.parse(json.target.response);
        let f_f2 = this.infoItems.querySelector(".nearby").querySelector('.first').querySelector('.f2');
        let name = obj.name;
        let weather = obj.weather[0].main;
        let temp = obj.main.temp;
        let imgPath;
        let str;
        switch (weather) {
            case "Clouds": imgPath = "./clouds.png"; break;
            case "Clear": if (date => 18 && date < 6) { imgPath = "./moon.png" }
            else { imgPath = "../images/sun.png" } break;
            case "Rain": imgPath = "./rain.png"; break;
        }
        str = `<div class="cityName">${name}</div><div class="image"><img src="${imgPath}" style="height: 20px;" alt=""></div><div class="temp">${temp} C</div>`
        f_f2.insertAdjacentHTML('beforeend', str);
    }
    nb3(json) {
        let obj = JSON.parse(json.target.response);
        let s_f1 = this.infoItems.querySelector(".nearby").querySelector('.seccond').querySelector('.f1');
        let name = obj.name;
        let weather = obj.weather[0].main;
        let temp = obj.main.temp;
        let imgPath;
        let str;
        switch (weather) {
            case "Clouds": imgPath = "./clouds.png"; break;
            case "Clear": if (date => 18 && date < 6) { imgPath = "./moon.png" }
            else { imgPath = "./sun.png" } break;
            case "Rain": imgPath = "./rain.png"; break;
        }
        str = `<div class="cityName">${name}</div><div class="image"><img src="${imgPath}" style="height: 20px;" alt=""></div><div class="temp">${temp} C</div>`
        s_f1.insertAdjacentHTML('beforeend', str);
    }
    nb4(json) {
        let obj = JSON.parse(json.target.response);
        let s_f2 = this.infoItems.querySelector(".nearby").querySelector('.seccond').querySelector('.f2');
        let name = obj.name;
        let weather = obj.weather[0].main;
        let temp = obj.main.temp;
        let imgPath;
        let str;
        switch (weather) {
            case "Clouds": imgPath = "./clouds.png"; break;
            case "Clear": if (date => 18 && date < 6) { imgPath = "./moon.png" }
            else { imgPath = "./sun.png" } break;
            case "Rain": imgPath = "./rain.png"; break;
        }
        str = `<div class="cityName">${name}</div><div class="image"><img src="${imgPath}" style="height: 20px;" alt=""></div><div class="temp">${temp} C</div>`
        s_f2.insertAdjacentHTML('beforeend', str);
    }
    setHourlyFromDay(day){
        let obj = this.hourlyList;
        // if (obj.cod == 404) {
        //     this.infoItems.innerHTML = " <img src='../images/404.png' style='height: 500px;' alt=''>";
        //     return;
        // }
        console.log(obj);
        let str = `<div class="infoItem hourlyWeather">
        <div class="headerH" ><div class="titleH" >HOURLY</div></div>
        <div class="hourlyItems">
                    <div class="hourlyItem first">
                        <div class="time">${day}</div>
                        <div class="image" style="height:83px ;"></div>
                        <div class="forecast">Forecast</div>
                        <div class="temp">Temp(C)</div>
                        <div class="realfeel">Real Feel</div>
                        <div class="wind">Wind (km/h)</div>
                     </div>`;
        obj.list.forEach(element => {
            let date = new Date(element.dt_txt);
            let currentDate = new Date();
            if (date.toDateString().split(' ')[0]==day) {
                let imgPath;

                switch (element.weather[0].main) {
                    case "Clouds": imgPath = "./clouds.png"; break;
                    case "Clear": if (date => 18 && date < 6) { imgPath = "./moon.png" }
                    else { imgPath = "./sun.png" } break;
                    case "Rain": imgPath = "./rain.png"; break;
                }

                let item = `
                     <div class="hourlyItem">
                        <div class="time">${date.getHours()} AM</div>
                        <div class="image" ><img src="${imgPath}" style="height:83px;" alt=""></div>
                        <div class="forecast">${element.weather[0].main}</div>
                        <div class="temp">${element.main.temp}</div>
                        <div class="realfeel">${element.main.feels_like}</div>
                        <div class="wind">${element.wind.deg} ESE</div>
                     </div>`;
                str += item;

            }
        });
        str += `</div>
        </div>`
       let hourly= this.infoItems.querySelector('.hourlyWeather');
       if(hourly!=null){hourly.remove();}
            this.infoItems.insertAdjacentHTML('beforeend', str);
    }
    setHourlyWeather(json, ret) {
        let obj = JSON.parse(json.target.response);
        if (obj.cod == 404) {
            this.infoItems.innerHTML = " <img src='./404.png' style='height: 500px;' alt=''>";
            return;
        }
        console.log(obj);
        let str = `<div class="infoItem hourlyWeather">
        <div class="headerH" ><div class="titleH" >HOURLY</div></div>
        <div class="hourlyItems">
                    <div class="hourlyItem first">
                        <div class="time">TODAY</div>
                        <div class="image" style="height:83px ;"></div>
                        <div class="forecast">Forecast</div>
                        <div class="temp">Temp(C)</div>
                        <div class="realfeel">Real Feel</div>
                        <div class="wind">Wind (km/h)</div>
                     </div>`;
        obj.list.forEach(element => {
            let date = new Date(element.dt_txt);
            let currentDate = new Date();
            if (date.toLocaleDateString() == currentDate.toLocaleDateString()) {
                let imgPath;

                switch (element.weather[0].main) {
                    case "Clouds": imgPath = "./clouds.png"; break;
                    case "Clear": if (date => 18 && date < 6) { imgPath = "./moon.png" }
                    else { imgPath = "./sun.png" } break;
                    case "Rain": imgPath = "./rain.png"; break;
                }

                let item = `
                     <div class="hourlyItem">
                        <div class="time">${date.getHours()} AM</div>
                        <div class="image" ><img src="${imgPath}" style="height:83px;" alt=""></div>
                        <div class="forecast">${element.weather[0].main}</div>
                        <div class="temp">${element.main.temp}</div>
                        <div class="realfeel">${element.main.feels_like}</div>
                        <div class="wind">${element.wind.deg} ESE</div>
                     </div>`;
                str += item;

            }
        });
        str += ` </div>
        </div>`
       
            this.infoItems.insertAdjacentHTML('beforeend', str);
        


    }
    fnS() {
        console.log("ok");
    }
    setCurrentWeather(json) {
        let obj = JSON.parse(json.target.response);
        let sun = new Date(obj.sys.sunrise);
        let set = new Date(obj.sys.sunset);
        let dt = new Date(obj.dt);
        console.log(obj);
        if (obj.cod == 404) {
            this.infoItems.innerHTML = " <img src='./404.png' style='height: 500px;' alt=''>";
            return;
        }
        let date = new Date();
        let NameTime = 'Sunny';
        let imgPath = "./sun.png";
        switch (obj.weather[0].main) {
            case "Clouds": imgPath = "./clouds.png"; break;
            case "Clear": if (date => 18 && date < 6) { imgPath = "./moon.png" }
            else { imgPath = "./sun.png" } break;
            case "Rain": imgPath = "./rain.png"; break;
        }
        let str = `<div class="infoItem currentWeather">
                    <div class="header">
                        <div class="title">
                            CURRENT WEATER
                        </div>
                        <div class="currentDate title">
                           ${date.toLocaleDateString()}
                        </div>
                    </div>
                    <div class="base">
                        <div class="baseItem imageItem">
                            <div><img src='${imgPath}' style="height:80px;"alt=""></div>
                        </div>
                        <div class="baseItem tempInfo">
                            <div class="temp">
                                ${obj.main.temp} C
                            </div>
                            <div class="realFeel">
                                Real Feel ${obj.main.feels_like} C
                            </div>
                        </div>
                        <div class="baseItem lastInfo">
                            <div class="sunrise">Sunrise: ${sun.getHours() + ":" + sun.getMinutes()} AM</div>
                            <div class="sunset">Sunset: ${set.getUTCHours() + ":" + set.getMinutes()} PM</div>
                            <div class="duration">Duration: ${dt.toLocaleTimeString()} hr</div>
                        </div>
                   </div>
                </div>`


        this.infoItems.innerHTML = "";
        this.infoItems.insertAdjacentHTML('beforeend', str);


    }
    defaultD() {
        document.querySelectorAll('.day').forEach((el) => {
            el.setAttribute('class', "day");
        })
    }
     defaultLi() {
        document.querySelectorAll('li').forEach((el) => {
            el.setAttribute('class', "");
        })
    }
}

let w = new Weather();
w.init();


