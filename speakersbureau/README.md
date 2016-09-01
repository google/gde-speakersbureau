Speakers Bureau
============

Speakers Bureau is a simple app which allows speakers to express the interest in attending one of events listed. User is able to filter events by date, location and topics.
The app uses FirebaseDB as a data store, front-end is based on Material Design Lite.

Disclaimer: This is not an official Google product

Pre-requisites
--------------

<!--These should be learning materials, not software requirements; samples
    should be entirely self-contained. Format as URLs in a list.-->
- [Firebase](https://firebase.google.com/docs/)
- [Material Design Lite](https://getmdl.io/started/)

Getting Started
---------------
1. Create your Firebase project
2. Populate Firebase DB with events in the format specified below
3. Configure Firebase object in index.html
a) Provide apiKey
b) Provide authDomain
c) Provide databaseURL
d) Provide storageBucket
4. Deploy to Firebase

Event format
------------
var events = {
  "eventID1" : {
    city : "Tarnow",
    country : "Poland",
    date : "2016-09-01",
    description : "Wonderful event",
    id : "eventID1",
    link : "http://tarnow.pl",
    name : "3rd Annual Conference on Superpowers",
    topics : "Superpowers, Magic",
    type : "CONFERENCE"     //"CONFERENCE" or "MEETUP"
  },
  "eventID2" : {...}
}

License
-------

Copyright 2016 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor
license agreements.  See the NOTICE file distributed with this work for
additional information regarding copyright ownership.  The ASF licenses this
file to you under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License.  You may obtain a copy of
the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
License for the specific language governing permissions and limitations under
the License.
