//-----------------------------------------------------------------------------------------------------------------------------------------    
//Start by stating all the variables
var Loclist=[],record,watchID,startposi,avgspeed=0,marker,startmarker,gpsstatus=false;
    
//Create a constructor function to use for gps data    
    
    
//Map creation stage-------------------------------------------------------------------------------------------------------------------------
 var map;
 function initMap() {
                       
    var map = new google.maps.Map(document.getElementById('map'), {
              center: {  lat: 0, lng: 0 },
                            zoom: 40 });
                       
    setInterval(function () {
    map.panTo(Loclist[Loclist.length - 1]) }, 5000);
     

 //GPS settings------------------------------------------------------------------------------------------------------------------------------
 posioptions = { 
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0};
     
watchID=navigator.geolocation.watchPosition(currentposl, errorss, posioptions);
  function currentposl(position) {
                     
  var currentPosi = {  lat: position.coords.latitude,
                       lng: position.coords.longitude,
                       accuracy: position.coords.accuracy,
                    }
  Loclist.push(currentPosi);//current position is added to the arrays of position
                    }
  function errorss(error) {
                    }
                 
//Info for the run data is set up in the form of constructor function---------------------------------------------------------------------------
function runnerinfo() {
    self = this
    this.name = "";this.route;this.points=[];this.totalDistance=0;this.circle;this.speed=0;this.calorie;
    this.startingtime = {
         time: 0,
         date: 0,
        };
    this.endingtime = {
         time: 0,
         date: 0,
                            }
          };
     
//Current position as of starting the app is marked using a marker______________________________________________________________________________
                     
 navigator.geolocation.getCurrentPosition(function(position) {
     startmarker = new google.maps.Marker({
     position:  {
     lat: position.coords.latitude,
     lng: position.coords.longitude },
     map: map,
     icon: 'http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png', });   
            })
 
//Run Button is pressed, the following will occur----------------------------------------------------------------------------------------------
                        
     runButton.onclick = function () {
            if (gpsstatus === false) {
                
//Set Interval to allow the function to be called on a constant basis to constantly update the run data by a per second basis---------------           
            
            record = setInterval(function () {
                      var totalTime,time;
                      var point = {lat: 0,lng: 0,acc: 0,
                                               }
                                        
             point.lat = Loclist[Loclist.length - 1].lat;
             point.lng = Loclist[Loclist.length - 1].lng;
             point.acc = Loclist[Loclist.length - 1].accuracy;
             point.time = new Date().getTime();
             run.points.push(point)
                                        
                                        
                                        
            if (marker != null){  marker.setMap(null);}//marker is contantly deleted and readded to ensure only a single moving marker is on the map 
    
             marker = new google.maps.Marker({
             position: run.points[run.points.length - 1],
             map: map,
            icon: 'http://maps.google.com/mapfiles/kml/paddle/go.png',
                                        });
                                        
             //A polyline is drawn based on the route travelled
            run.route.setPath(run.points)
             //Update the circle
            run.circle.setCenter(run.points[run.points.length - 1]);
            run.circle.setRadius(run.points[run.points.length - 1].accuracy);

                 
//Formula is used as to calculate misc data related to the geolocation data-----------------------------------------------------------------------------
                                        
             calcSpeed();
                                     
             document.getElementById("totalDistance").innerHTML = "Distance travelled:" + run.totalDistance + "m";
             totalTime = new Date(run.points[run.points.length - 1].time - run.points[1].time).toGMTString().substring(17, 25);
             document.getElementById("totalTime").innerHTML = "total time:" + totalTime;
             avgspeed = (run.totalDistance / ((run.points[run.points.length - 1].time - run.points[1].time) / 1000))
             document.getElementById("meanspeed").innerHTML = "Average Speed: " + avgspeed + "ms";
             document.getElementById("caloriesburnt").innerHTML = "Calories Burnt:" + run.calories + "j";

                                    },
                                    1000);
                                
//A new object is created using said constructor function------------------------------------------------------------------------------------------------
             run = new runnerinfo();
                
                
//Set start time and set up polyline & circle-------------------------------------------------------------------------------------------------------------
            
            run.startingtime.date = new Date().toDateString();
            run.startingtime.time = new Date().toTimeString();
            run.route = new google.maps.Polyline({
                                    path: run.points,
                                    geodesic: true,
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 3,
                                    map: map
                                });


            run.circle = new google.maps.Circle({
                                    map: map,
                                    fillColor: "#0066FF",
                                    fillOpacity: "0.1",
                                    strokeColor: "#0000FF",
                                });
                            
                
                                gpsstatus = true;//switch the gpsstatus to true to avoid function overlapping itself
                                runButton.innerHTML = ("Press to delete run ")
                            } 
//condition when the gpsstatus is set to true
         
                 else if (gpsstatus === true) { 
                                var ifContinue = confirm("Confirmation to delete current run") 
                                if (ifContinue === true) {
                                    deleteall()
                                    delete run
                                }
                            }
                        }
                    }
//stop button function--------------------------------------------------------------------------------------------------------------
					stopButton.onclick=function(){
					navigator.geolocation.clearWatch(watchID)
					var endMarker=new google.maps.Marker({
										position:run.points[run.points.length-1],
										map:map,
										icon:"http://maps.google.com/mapfiles/kml/paddle/go.png",
										
										})
					
					}
                    
//save button is pressed------------------------------------------------------------------------------------------------------------
                     saveButton.onclick = function () {
                        
                            run.endingtime.date = new Date().toDateString();
                            run.endingtime.time = new Date().toTimeString();
                            clearInterval(record) //Stop recording

                            for (i = 1; i <= 100; i++) {
                                var databank = "runningdata" + i;
                                if (localStorage.getItem(databank) === null) {
                                    console.log(databank);
                                    break;
                                }

                            }

                            //ask user for run's name for storage
							run.speed=avgspeed;
                            run.name = prompt("What's the name of this run?", databank);
                            deleteall()
                            localStorage.setItem(databank, JSON.stringify(run));
                            delete run
                             
                    }
					
//function used to clear all the variables when called-------------------------------------------------------------------------------------------                   
                    function deleteall() {
                        clearInterval(record); //Stop timer, i.e. stop copying data
                        gpsstatus = false; 
                        run.route.setMap(null);
                        run.circle.setMap(null);
                        run.route = null;
                        run.circle = null;
						startmarker=null;
                        document.getElementById("displaySpeed").innerHTML = null;
                        document.getElementById("runButton").innerHTML = ("run again!")
                        document.getElementById("totalDistance").innerHTML = "";
                        document.getElementById("totalTime").innerHTML = "";
                        document.getElementById("meanspeed").innerHTML = "";
                       

                    }

//Function to display speed, called in the run function------------------------------------------------------------------------------------------
                     function calcSpeed() {
                        var converter = Math.PI / 180;
                        var earthradius = 2 * 6.37e6
                        var speedDisp = document.getElementById("displaySpeed");
                        var distance = pointsdistance(run.points[run.points.length - 1], run.points[run.points.length - 2]);
                        run.totalDistance += distance;
                        run.calories = run.totalDistance / 16.0934
                        var speed = distance / (run.points[run.points.length - 1].time - run.points[run.points.length - 2].time) / 1000;
                        var outString = "Speed:" + speed + "m/s"
                        speedDisp.innerHTML = outString;
                        function pointsdistance(A, B) {
                            var latA = A.lat * converter;
                            var lngA = A.lng * converter;
                            var latB = B.lat * converter;
                            var lngB = B.lng * converter;
                            var d = 2 * earthradius * Math.asin(Math.sqrt(Math.pow(Math.sin(0.5 * (latB - latA)), 2) + Math.cos(latA) * Math.cos(latB) * Math.pow(Math.sin(0.5 * (lngB - lngA)), 2))); 
                            return d;
                        }
                    }
