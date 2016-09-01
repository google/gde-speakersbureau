// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////////
//


function loadEvents() {
  var loadingSection = document.getElementById('loading-section');
  loadingSection.style.display = "flex";

    firebase.database().ref('events/').on('value', function(snapshot) {
      updateEvents(snapshot.val());
      prepareFilters();
      renderEvents(eventsStore);
    });
}

function updateEvents(ev) {
  var loadingSection = document.getElementById('loading-section');
  loadingSection.style.display = "none";
  eventsStore = ev;
}

function renderEvents(events) {
  var filteredSortedEvents = filterSortEvents(events);

  //clear the list
  var eventsContainer = document.getElementById('events-container');
  while (eventsContainer.lastChild) {
    eventsContainer.removeChild(eventsContainer.lastChild);
  }
  eventsElements = {};

  var month = "";

  //render filtered and sorted elements
  for (var i=0; i<filteredSortedEvents.length; i++) {
    var event = filteredSortedEvents[i];
    var eventMonth = event.date.slice(5,7);
    if (eventMonth != month) {
      month = eventMonth;
      eventsContainer.appendChild(createMonthElement(month));
    }

    if (EVENT_TYPE.MEETUP_NODATE == event.type) {
      event.displayDate = MONTH_MAP[eventMonth] + " - any day";
    }

    var sectionElement = createEventElement(event);
    var id = event.id;
    eventsElements[id] = sectionElement;
    if (events[id].interested && events[id].interested[gUser.uid]) {
      updateInterestedElement(id, true);
    }
    eventsContainer.appendChild(sectionElement);
    upgradeToMDL(sectionElement);
  }
}

function upgradeToMDL(sectionElement) {
  var interestedPhotosElement = sectionElement.children[1].children[3].children[1];
  for (var i=0; i<interestedPhotosElement.children.length; i++) {
    if (i%2) {
      //MDL upgrade of a dynamic element
      componentHandler.upgradeElement(interestedPhotosElement.children[i]);
    }
  }


}

function interested(id, isInterested) {
  console.log("Interested: " + id + " " + isInterested);
  updateInterestedElement(id, isInterested);
  updateInterestedEvent(id, isInterested);
}

function updateInterestedElement(id, isInterested) {
  var sectionElement = eventsElements[id];
  if (sectionElement) {
    var actionsElement = sectionElement.children[1].children[3];
    if (actionsElement) {
      if (isInterested) {
        actionsElement.classList.add("interested");
        var linkElement = actionsElement.children[0];
        if (linkElement) {
          linkElement.classList.add("mdl-color-text--grey-700");
          linkElement.onclick = function() {
            interested(id, false);
          };
        }
      } else {
        actionsElement.classList.remove("interested");
        var linkElement = actionsElement.children[0];
        if (linkElement) {
          linkElement.classList.remove("mdl-color-text--grey-700");
          linkElement.onclick = function() {
            interested(id, true);
          };
        }
      }
    }
  } else {
    console.log("No element for id=" + id);
  }
}

function updateInterestedEvent(id, isInterested) {
  var event = eventsStore[id];
  if (event && gUser) {
    var ref = firebase.database().ref('events20160712/' + id + '/interested/');
    if (isInterested) {
      var updates = {};
      updates[gUser.uid] = gUser;
      ref.update(updates);
    } else {
      var interestedUserRef = ref.child(gUser.uid);
      if (interestedUserRef) {
        interestedUserRef.remove();
      }
    }
  } else {
    console.log("No event entry for id=" + id);
  }
}

var MONTH_MAP = {
  "01" : "January",
  "02" : "February",
  "03" : "March",
  "04" : "April",
  "05" : "May",
  "06" : "June",
  "07" : "July",
  "08" : "August",
  "09" : "September",
  "10" : "October",
  "11" : "November",
  "12" : "December"
}

function createMonthElement(month) {
  var sectionElement = document.createElement('section');
  var labelElement = document.createElement('h4');
  labelElement.classList.add('month-separator');
  labelElement.classList.add('mdl-grid');
  labelElement.classList.add('mdl-card__title-text');
  labelElement.classList.add('mdl-grid--no-spacing');
  labelElement.classList.add('mdl-color-text--blue-800');
  labelElement.textContent = MONTH_MAP[month];
  sectionElement.appendChild(labelElement);
  return sectionElement;
}

var photoTooltipId = 0;

function createEventElement(event) {
  var sectionElement = document.createElement('section');
  sectionElement.className = "event-entry mdl-grid mdl-grid--no-spacing mdl-shadow--2dp";
  var strVar="";
strVar += "            <header class=\"mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100\">";
strVar += "              <div class=\"event-header mdl-color-text--grey-700\">";
strVar += "                <div class=\"event-date\"><h4>" + (event.displayDate ? event.displayDate : event.date) + "<\/h4><\/div>";
strVar += "                <div class=\"vertical-spacer\"> <\/div>";
strVar += "                <div class=\"event-location\">";
strVar += "                 <div class=\"\"><h5>" + event.city + "<\/h5><\/div>";
strVar += "                 <div class=\"event-country\"><h5>" + event.country + "<\/h5><\/div>";
strVar += "            <\/div><\/div><\/header>";
strVar += "            <div class=\"mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone\">"; //removed mdl-card
strVar += "              <div class=\"mdl-card__title\">";
strVar += "                <h2 class=\"mdl-card__title-text mdl-color-text--grey-700\">" + event.name + "<\/h2>";
strVar += "              <\/div>";
strVar += "              <div class=\"mdl-card__supporting-text event-description\">";
strVar += "                " + event.description;
strVar += "              <\/div>";
strVar += "              <div class=\"event-topics\">";
strVar += "                " + event.topics;
strVar += "              <\/div>";
strVar += "              <div class=\"mdl-card__actions mdl-card--border interested-container\">";
strVar += "                <a onclick=\"interested('" + event.id + "', true)\" class=\"mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect interested-button\"><i class=\"material-icons interested_icon\">event<\/i> I'm interested!<\/a>";
strVar += "                <div class=\"interested-photos\">";
strVar += "                <\/div>";
strVar += "              <\/div>";
strVar += "            <\/div>";
sectionElement.innerHTML = strVar;


var interestedPhotosElement = sectionElement.children[1].children[3].children[1];
if (interestedPhotosElement && event.interested && Object.keys(event.interested).length > 0) {
  Object.keys(event.interested).forEach(function(key, index) {
    var tooltipId = "tooltip-id-" + photoTooltipId++;
    var interestedPerson = event.interested[key];
    var imageElement = document.createElement('img');
    imageElement.src = interestedPerson.photoURL;
    imageElement.classList.add("interested-photo");
    imageElement.id = tooltipId;
    interestedPhotosElement.appendChild(imageElement);
    var labelElement = document.createElement('div');
    labelElement.classList.add('mdl-tooltip');
    labelElement.setAttribute("for", tooltipId);
    labelElement.textContent = interestedPerson.displayName;
    interestedPhotosElement.appendChild(labelElement);
  });
}

return sectionElement;
}
