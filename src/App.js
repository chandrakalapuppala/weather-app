import React,{useState,useEffect} from 'react';
import './App.css';
import cloudy from './img/cloudy.jpg';
import {FaArrowUp,FaArrowDown,FaWind} from 'react-icons/fa';
import {BiHappy} from 'react-icons/bi';
import {WiHumidity,WiTime3,WiThermometer} from 'react-icons/wi';
import {MdCompress} from 'react-icons/md';
import {GiSunrise,GiSunset} from 'react-icons/gi';
import {BsCalendar2Date} from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const [citiesData,setCitiesData]=useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const [selectedCity,setSelectedCity]=useState('');
  const[sunSet,setSunSet]=useState('');
  const [sunRise,setSunRise]=useState('');
  const [temperature,setTemperature]=useState('');
  const[minTemperature,setMiniTemperature]=useState('');
  const [maxTemperature,setMaxTemperature]=useState('');
  const [temperatureFeels,setTemperatureFeels]=useState('');
  const [humidity,setHumidity]=useState('');
  const [description,setDescription]=useState('');
  const [pressure,setPressure]=useState('');
  const [windSpeed,setWindSpeed]=useState('');
  const [currrentDate,setCurrentDate]=useState('');
  const [currentTime,setCurrentTime]=useState('');
  const [isWeatherVisible,setIsWeatherVisible]=useState(false);
  const [errorMessage,setErrorMessage]=useState('');
  useEffect(()=>{
   
    const apiUrl = 'https://secure.geonames.org/searchJSON?country=IN&maxRows=1000&username=Chandrakala';

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
      const cities =data.geonames.map((city)=>({
        name:city.name
      }));
      cities.sort((a,b)=>a.name.localeCompare(b.name));
      setCitiesData(cities);
      setIsLoading(false);
    })
    .catch((error)=>
    {
      console.error('Error fetching city data:',error);
    });
  },[]);
  const handleCityChange=(event)=>{
    setSelectedCity(event.target.value);
    fetchWeatherData(event.target.value);
    
  };
  const fetchWeatherData=(cityName)=>{
    const apiKey='18feb12da435c6a62616d4ae6d243247';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    .then((res)=>{
      if(!res.ok){
        throw new Error('city not found');
      
      }
      return res.json();
    })
    .then((data)=>{
      const weatherDescription =data.weather[0].description;
      setDescription(weatherDescription);
      const rise=new Date(data.sys.sunrise*1000);
      const riseTime=rise.toLocaleTimeString();
      const set=new Date(data.sys.sunset*1000);
      const setTime=set.toLocaleTimeString();
      const date =new Date(data.dt*1000);
      const year=date.getFullYear();
      const month =date.getMonth()+1;
      const day= date.getDate();
      const hours=date.getHours();
      const minutes =date.getMinutes();
      const seconds =date.getSeconds();
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      setCurrentDate(`${year}-${month}-${day}`)
        setErrorMessage('');
        setIsWeatherVisible(true);
         setSunSet(setTime);
         setSunRise(riseTime);
         setTemperature(Math.round(data.main.temp-273));
         setMiniTemperature(Math.round(data.main.temp_min-273));
         setMaxTemperature(Math.round(data.main.temp_max-273));
         setTemperatureFeels(Math.round(data.main.feels_like-273));
         setHumidity(data.main.humidity);
         setPressure(data.main.pressure);
          setWindSpeed(Math.round(data.wind.speed));

    })
    .catch((error)=>{
      console.error('Error fetching weather data:',error);
      setIsWeatherVisible(false);
      setErrorMessage('Weather details not found for this city');
    });
  };
  return (
    <div className='center-container'>
      <center>
      <h1>Weather App</h1>
      {isLoading ? (
        <p>Loading.....</p>
      ) : (
        <div className={`container ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
          <label >Select a City:    </label>
          <select value={selectedCity} onChange={handleCityChange}>
            <option value="">Select a city</option>
            {citiesData.map((city, index) => (
              <option key={index} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {isWeatherVisible?(
          <div className='card'>
          <div className='section'>
            <div className='section_section'>
              <h2>
                {selectedCity}
              </h2>
              <img src={cloudy} alt=''width={30} height={30}/>
              <p>{description}  </p>
            </div>
            <div className='section2'>
            <h2><WiThermometer/> {temperature}°C</h2>
            <p><WiTime3/> {currentTime}</p>
            <p><BsCalendar2Date/> {currrentDate}</p>
          </div>
          </div>
          <div className='section1'>
            <div className='section1_section'>
              <p><FaArrowDown/> Min</p>
              <h2>{minTemperature}°C</h2>
            </div>
            <div className='section1_section'>
              <p><FaArrowUp/> Max</p>
              <h2>{maxTemperature}°C</h2>
            </div>
            <div className='section1_section'>
              <p><BiHappy/> Feels like</p>
              <h2>{temperatureFeels}°C</h2>
            </div>
          </div>
          <div className='section1'>
            <div className='section1_section'>
              <p><WiHumidity/>Humidity</p>
              <h2>{humidity}%</h2>
            </div>
            <div className='section1_section'>
              <p><FaWind/> wind speed</p>
              <h2>
                {windSpeed}m/h
              </h2>
            </div>
            <div className='section1_section'>
              <p><MdCompress/>pressure</p>
              <h2>
                {pressure}hpa
              </h2>
            </div>
          </div>
          <div className='section1'>
            <div className='section1_section'>
              <p><GiSunrise/>  sunrise</p>
              <h2>
                {sunRise}
              </h2>
            </div>
            <div className='section1_section'>
              <p><GiSunset/> sunset</p>
              <h2>
                {sunSet}
              </h2>
            </div>
          </div>
        </div>
        ):
        <div className='error-message'>
          {errorMessage}
          </div>
        }
        </div>
      )}
      </center>
    </div>
  );
};

export default App;

