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


var filters = {};
var filtersElements = {};

function prepareFilters() {
  //check countries
  var countries = {};
  var topics = {}
  var countriesList = [];
  var topicsList = [];
  filtersElements["countries"] = {};
  filtersElements["topics"] = {};

  Object.keys(eventsStore).forEach(function(key, index) {
    var country = eventsStore[key].country;
    if (countries[country]) {
      countries[country] = countries[country] + 1;
    } else {
      countries[country] = 1;
      countriesList.push(country)
    }

    var eventTopics = eventsStore[key].topics;
    if (eventTopics) {
      var eventTopicsArray = eventTopics.split(",");
      for (var i=0; i<eventTopicsArray.length; i++) {
        var topic = eventTopicsArray[i].trim();
        if (topics[topic]) {
          topics[topic] = topics[topic] + 1;
        } else {
          topics[topic] = 1;
          topicsList.push(topic)
        }
      }
    }
  });

  countriesList.sort();
  topicsList.sort();

  generateDynamicFilter('countries', 'filter-country', countriesList);
  generateDynamicFilter('topics', 'filter-topic', topicsList);

  updateFilters();

}

function generateDynamicFilter(prefix, filterElementName, optionsList) {
  var optionContainer = document.getElementById(filterElementName);
  while (optionContainer.lastChild) {
    optionContainer.removeChild(optionContainer.lastChild);
  }

  var allElement = createOptionElement(prefix, "All", "selectAll(\'" + prefix + "\')", true);
  optionContainer.appendChild(allElement);
  componentHandler.upgradeElement(allElement.children[0]);

  for (var i=0; i<optionsList.length; i++) {
    var option = optionsList[i];
    var optionElement = createOptionElement(prefix, option, "updateFiltersAndRenderEvents()");
    var checkboxElement = optionElement.children[0];

    if (filters[prefix] && !filters[prefix][option] && checkboxElement) {
      checkboxElement.checked = false;
    }
    filtersElements[prefix][option] = optionElement;
    optionContainer.appendChild(optionElement);
    //MDL upgrade of a dynamic element
    componentHandler.upgradeElement(checkboxElement);
  }
}

function selectAll(prefix) {
  var value = document.getElementById(prefix + '-All').checked;

  Object.keys(filtersElements[prefix]).forEach(function(key, index) {
      var inputElement = filtersElements[prefix][key].children[0];
      if (inputElement) {
        if (value) {
          inputElement.MaterialCheckbox.check();
        } else {
          inputElement.MaterialCheckbox.uncheck();
        }
      }
    });

  updateFiltersAndRenderEvents();
}

function updateFilters() {
  filters["countries"] = {};
  Object.keys(filtersElements["countries"]).forEach(function(key, index) {
    var inputElement = filtersElements["countries"][key].children[0].children[0];
    if (inputElement) {
      if (inputElement.checked) {
        filters.countries[key] = true;
      } else {
        filters.countries[key] = false;
      }
    }
  });
  filters["topics"] = {};
  Object.keys(filtersElements["topics"]).forEach(function(key, index) {
    var inputElement = filtersElements["topics"][key].children[0].children[0];
    if (inputElement) {
      if (inputElement.checked) {
        filters.topics[key] = true;
      } else {
        filters.topics[key] = false;
      }
    }
  });
  filters["future-events"] = document.getElementById('future-events').checked;
}

function filterSortEvents(ev) {
  var filteredSortedEvents = [];

  Object.keys(ev).forEach(function(key, index) {
    var event = ev[key];
    if (filterEvent(event)) {
      filteredSortedEvents.push(event);
    }
  });

  filteredSortedEvents.sort(function (a, b){
    var date1 = a.date;
    var date2 = b.date;
    if (date1 == date2) {
      return 0;
    } else {
      return (date1 > date2) ? 1 : -1;
    }
  });


  return filteredSortedEvents;
}

function filterEvent(event) {
  if (!filters.countries[event.country]) {
      return false;
  }


  if (filters["future-events"]) {
    var today = new Date().toISOString().slice(0, 10);
    if (event.date < today) {
      return false;
    }
  }

  var topicMatch = false;
  var topics = Object.keys(filters["topics"]);
  for (var i=0; i<topics.length; i++) {
    var topic = topics[i];
    var topicValue = filters["topics"][topic];
    if (topicValue) {
      if (event.topics.search(topic) > -1) {
        topicMatch = true;
        break;
      }
    }
  }
  if (!topicMatch) {
    return false;
  }

  return true;
}

function createOptionElement(prefix, label, functionName, fullsize) {
  var divElement = document.createElement('div');
  if (fullsize) {
    divElement.className = "mdl-cell mdl-cell--12-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone";
  } else {
    divElement.className = "mdl-cell mdl-cell--3-col-desktop mdl-cell--4-col-tablet mdl-cell--2-col-phone";
  }

  var strVar="";
  strVar += "              <label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"" + prefix + "-" + label + "\">";
  strVar += "                <input onclick=\"" + functionName + "\" type=\"checkbox\" id=\"" + prefix + "-" + label + "\" class=\"mdl-checkbox__input\" checked>";
  strVar += "                <span class=\"mdl-checkbox__label\"> " + label + "<\/span>";
  strVar += "              <\/label>";
  divElement.innerHTML = strVar;
  return divElement;
}
