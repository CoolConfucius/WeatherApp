// 'use strict';
var currentLocation = {}; 
var citiesList = []; 

var app = {
  init: function(){
    app.getCurrentLocation(); 
    $('#go').click(app.goClicked);
    $('#citiesList').on('click', '.listedCity', app.listClicked)
  },
  getCurrentLocation: function(){
    $.get('http://api.wunderground.com/api/58853d29672309fb/geolookup/q/autoip.json', function(data){
      currentLocation.country = data.location.country;
      currentLocation.state = data.location.state; 
      currentLocation.city = data.location.city; 
      currentLocation.lat = data.location.lat; 
      currentLocation.lon = data.location.lon; 
      $('#searchState').attr('value', currentLocation.state);
      $('#searchCity').attr('value', currentLocation.city);
    });
  },
  getConditions: function(){
    $.get('http://api.wunderground.com/api/58853d29672309fb/conditions/q/'+app.state +'/' + app.city + '.json', function(data){
      var current_observation = data.current_observation; 
      var display_location = current_observation.display_location;  
      var city = display_location.city; 
      var country = display_location.country; 
      var state = display_location.state;   
      var latitude = display_location.latitude; 
      var longitude = display_location.longitude; 
      var iconUrl = current_observation.icon_url;
      var weather = current_observation.weather; 
      var temperature_string = current_observation.temperature_string;
      var wind_string = current_observation.wind_string;
      var pressure_in = current_observation.pressure_in;
      var dewpoint_string = current_observation.dewpoint_string;
      var feelslike_string = current_observation.feelslike_string;
      var UV = current_observation.UV;
      var precip_1hr_string = current_observation.precip_1hr_string;

      var $currentIcon = $('<img>').attr('src', iconUrl);
      var $weather = $('<li>').text(weather); 
      var $temperature_string = $('<li>').text("Temperature: "+temperature_string);
      var $wind_string = $('<li>').text("Wind: "+wind_string);
      var $pressure_in = $('<li>').text("Pressure: "+pressure_in);  
      var $dewpoint_string = $('<li>').text("Dewpoint: "+dewpoint_string);
      var $feelslike_string = $('<li>').text("Feels like: "+feelslike_string);
      var $UV = $('<li>').text("UV: "+UV);
      var $precip_1hr_string = $('<li>').text("Rain: "+precip_1hr_string);
      var $today_overview = $('<ul>');
      $today_overview.append($temperature_string,$wind_string,$pressure_in,$dewpoint_string,$feelslike_string,$UV,$precip_1hr_string); 

      var $todayDiv = $('<div>').addClass('today'); 
      $todayDiv.append($currentIcon, $weather, $today_overview); 
      $('#conditions').append($todayDiv); 
    }); 
},
getForecast: function(){
  $.get('http://api.wunderground.com/api/58853d29672309fb/forecast/q/'+app.state +'/' + app.city + '.json', function(data){
    var forecast = data.forecast.txt_forecast.forecastday; 
    var forecastLength = forecast.length; 
    $forecastDiv = $('<div>').addClass('row forecast');

    forecast.forEach( function(element, index, array){
      var $forecastList = $('<ul>').addClass('col col-sm-6');
      var $title = $('<li>').text(element.title);
      var $icon_url = $('<img>').attr('src', element.icon_url);
      var $fcttext = $('<li>').text(element.fcttext);
      var $fcttext_metric = $('<li>').text(element.fcttext_metric);
      $forecastList.append($title, $icon_url, $fcttext, $fcttext_metric); 
      $forecastDiv.append($forecastList);
    });         
    $('#forecast').append($forecastDiv); 
  }); 
},
getHourly: function(){
  $.get('http://api.wunderground.com/api/58853d29672309fb/hourly/q/'+app.state +'/' + app.city + '.json', function(data){
    var hourly = data.hourly_forecast;
    var hourlyLength = hourly.length;               
    $hourlyDiv = $('<div>').addClass('row hourly');

    hourly.forEach( function(element, index, array){        
      var $hourlyList = $('<ul>').addClass('col col-sm-2');
      var $FCTTIME = $('<li>').text(element.FCTTIME.pretty);
      var $icon_url = $('<img>').attr('src', element.icon_url);
      var $condition = $('<li>').text(element.condition);
      var $temp = $('<li>').text('Tempreature: English: '+element.temp.english+', Metric: '+element.temp.metric);
      var $wind = $('<li>').text('Wind: English speed: '+element.wspd.english+', Metric: '+element.wspd.metric+". Direction: "+element.wdir.dir);
      $hourlyList.append($FCTTIME, $icon_url, $condition, $temp, $wind); 
      $hourlyDiv.append($hourlyList);

    });   
    $('#hourly').append($hourlyDiv);
  }); 
},
clear: function(){
  $('#conditions').text(''); 
  $('#forecast').text(''); 
  $('#hourly').text(''); 
},

goClicked: function() {    
  app.clear(); 
  app.state = $('#searchState').val().toUpperCase(); 
  app.city = $('#searchCity').val().replace(/\s/g, '_'); 
  citiesList.push(app.state+'/'+app.city);
  citiesList = _.uniq(citiesList);
  var $buttonsRow = $('<div>'); 
  citiesList.forEach(function(entry){
    var $button = $('<div>').addClass('btn btn-primary listedCity').text(entry);
    $buttonsRow.append($button);
  })
  $('#citiesList').append($buttonsRow);
  $('h2').removeClass('hide');
  $('#cityHead').text(app.state + " , " + app.city);
  app.getConditions(); 
  app.getForecast(); 
  app.getHourly();
}, 
listClicked: function(){
  app.clear(); 
  var $pair = $(this).text().split('/');
  app.state = $pair[0];
  app.city = $pair[1];
  $('h2').removeClass('hide');
  $('#cityHead').text(app.state + " , " + app.city);
  app.getConditions(); 
  app.getForecast(); 
  app.getHourly();
}



}

$(document).ready(app.init);