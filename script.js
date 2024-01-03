//getting all HTML elements to JS file
let body = document.querySelector('body');
let timeZoneSelector = document.getElementById('timezone-selector');
let selectButton = document.getElementById('select-button');
let timeSection = document.getElementById('time-section');
let timeZone = document.getElementById('timezone');
let time = document.getElementById('timezone-');
let hours = document.getElementById('hours');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');
let otherTimeDetails = document.getElementById('other-time-details');
let utc = document.getElementById('utc');
let dateSection = document.getElementById('date-section');
let date = document.getElementById('date');
let dayName = document.getElementById('day-name');
let day = document.getElementById('day');
let month = document.getElementById('month');
let year = document.getElementById('year');
let newOptionClass = document.getElementsByClassName('new-option-class');

//load timezone options upon page loading
window.onload = () => {

         fetch('https://api.timezonedb.com/v2.1/list-time-zone?key=9V7W8217C8PV&format=json')
         .then((res) => { return res.json(); })
         .then((data) => {   
            
            for (let index = 0; index < data.zones.length; index++) {
            let newOption = document.createElement('option');
            let optionText = document.createTextNode(data.zones[index].zoneName);
            newOption.appendChild(optionText);
            newOption.classList.add('new-option-class');
            timeZoneSelector.appendChild(newOption);  
            
            //select GMT as default option
            if(data.zones[index].zoneName == 'Europe/London') {
                newOptionClass[index].setAttribute('selected',"");
            }
        } 
        //call function to display GMT data
        newTimeZoneData();          
    });    
}
    //new timezone interval variable 
    let newInterval;

let newTimeZoneData = () => {

    fetch('https://api.timezonedb.com/v2.1/get-time-zone?key=9V7W8217C8PV&format=json&by=zone&zone='+ timeZoneSelector.value + '')
    .then((res) => { return res.json(); })
    .then((data) => {
       
       //clear DOM elements before rerendering
       timeZone.innerText = '';
       hours.innerText = '';
       minutes.innerText = '';
       seconds.innerText = '';
       utc.innerText = '';
       
       day.innerText = '';
       month.innerText = '';
       year.innerText = '';

   //reflect data in time DOM  elements
       let timeZoneNode =timeZoneSelector.value;
       timeZone.insertAdjacentHTML('beforeend', timeZoneNode);
       let hoursNode = parseInt(data.formatted.substring(11,13));
       hours.insertAdjacentHTML('beforeend',hoursNode);
       let minutesNode = parseInt(data.formatted.substring(14,16));
       minutes.insertAdjacentHTML('beforeend',minutesNode);
       let secondsNode = parseInt(data.formatted.substring(17,19));
       seconds.insertAdjacentHTML('beforeend',secondsNode);
       let utcNode = parseInt(data.gmtOffset)/3600;
       utc.insertAdjacentHTML('beforeend',' GMT: ');

       if(utcNode > 0) {
        utc.insertAdjacentHTML('beforeend','+' + utcNode);
       }
       
       else {
        utc.insertAdjacentHTML('beforeend', utcNode);
       }
       
       

   //clear previous time interval from newInterval variable
   clearInterval(newInterval);
   newInterval = null;

   //time changer interval
   newInterval = setInterval(() => {

   //clear data in time DOM elements
   hours.innerText = '';
   minutes.innerText = '';
   seconds.innerText = '';

   //conditions for increasing hours,seconds and minutes
   if (secondsNode == 59) {
       secondsNode -= 59;
       minutesNode ++;

       if (minutesNode > 59) {
           minutesNode -= 60;
           hoursNode++;

           if (hoursNode > 24) {
               hoursNode -= 24;
           }
       }            
   }       
   else {
       secondsNode++;
   }
  
   //rerender elements after time change
   if (secondsNode < 10) {
       seconds.insertAdjacentHTML('beforeend','0');
   }
   if (minutesNode < 10) {
       minutes.insertAdjacentHTML('beforeend','0');
   }
   if (hoursNode < 10) {
       hours.insertAdjacentHTML('beforeend','0');
   }

   hours.insertAdjacentHTML('beforeend',hoursNode);
   minutes.insertAdjacentHTML('beforeend',minutesNode);
   seconds.insertAdjacentHTML('beforeend',secondsNode);
 }, 1000);

        //clear data in date dom elements
        dayName.innerText = '';
        day.innerText = '';
        month.innerText = '';
        year.innerText = '';

    let newDate = data.formatted.substring(0,10);
    let currentDayName = getDay(new Date(parseInt(newDate)+1), 'en-US');
    let currentMonthName = getMonth(new Date(newDate), 'en-US');

       //reflect data in date dom elements
    let dayNameNode = document.createTextNode(currentDayName);
    dayName.appendChild(dayNameNode); 
    let dayNode = document.createTextNode(data.formatted.substring(8,10));
     day.appendChild(dayNode); 
    let monthNameNode = document.createTextNode(currentMonthName);
      month.appendChild(monthNameNode);  
    let yearNode = document.createTextNode(data.formatted.substring(0,4));
      year.appendChild(yearNode); 

      selectImage(hoursNode);
    })

}
//select timezone on button click
selectButton.addEventListener('click', newTimeZoneData);

//functions to convert date into day and month name
let getDay = (date, locale) => {
    return date.toLocaleDateString(locale, {weekday: 'long'});
}

let getMonth = (date, locale) => {
    return date.toLocaleDateString(locale, {month: 'long'});
}

let selectImage = (hour) => {
    if (hour > 4 && hour < 18) {
        body.style.backgroundImage = 'linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,0.4)), url(images/day-1.jpg)';
    }
    else {
        body.style.backgroundImage = 'linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,0.4)), url(images/night-1.jpg)';
    }
}