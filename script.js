//getting all HTML elements to JS file
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

         fetch('http://worldtimeapi.org/api/timezone')
         .then((res) => { return res.json(); })
         .then((data) => {  

            for (let index = 0; index < data.length; index++) {
            let newOption = document.createElement('option');
            let optionText = document.createTextNode(data[index]);
            newOption.appendChild(optionText);
            newOption.classList.add('new-option-class');
            timeZoneSelector.appendChild(newOption);  
            
            //select GMT as default option
            if(data[index] == 'Etc/GMT') {
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

    fetch('http://worldtimeapi.org/api/timezone/'+ timeZoneSelector.value + '')
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
       let hoursNode = parseInt(data.datetime.substring(11,13));
       hours.insertAdjacentHTML('beforeend',hoursNode);
       let minutesNode = parseInt(data.datetime.substring(14,16));
       minutes.insertAdjacentHTML('beforeend',minutesNode);
       let secondsNode = parseInt(data.datetime.substring(17,19));
       seconds.insertAdjacentHTML('beforeend',secondsNode);
       let utcNode = parseInt(data.utc_offset.substring(0,3));
       utc.insertAdjacentHTML('beforeend',utcNode);
       utc.insertAdjacentHTML('beforeend',' Hour');
       

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

    let newDate = data.datetime.substring(0,10);
    let currentDayName = getDay(new Date(newDate), 'en-US');
    let currentMonthName = getMonth(new Date(newDate), 'en-US');

       //reflect data in date dom elements
    let dayNameNode = document.createTextNode(currentDayName);
    dayName.appendChild(dayNameNode); 
    let dayNode = document.createTextNode(data.datetime.substring(8,10));
     day.appendChild(dayNode); 
    let monthNameNode = document.createTextNode(currentMonthName);
      month.appendChild(monthNameNode);  
    let yearNode = document.createTextNode(data.datetime.substring(0,4));
      year.appendChild(yearNode); 
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