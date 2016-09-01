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


var eventsStore = {};
var eventsElements = {};
var gUser = null;

var EVENT_TYPE = {
  MEETUP : "MEETUP",
  MEETUP_NODATE : "MEETUP_NODATE",
  CONFERENCE : "CONFERENCE"
}

var User = function(uid, email, displayName, photoURL) {
  this.uid = uid;
  this.email = email;
  this.displayName = displayName;
  this.photoURL = photoURL;
};

function updateFiltersAndRenderEvents() {
  updateFilters();
  renderEvents(eventsStore);
}

function clearOnLogout() {
  var eventsContainer = document.getElementById('events-container');
  while (eventsContainer.lastChild) {
    eventsContainer.removeChild(eventsContainer.lastChild);
  }
  eventsElements = {};
  eventsStore = {};
  gUser = null;
  filters = {};
  filtersElements = {};
}




