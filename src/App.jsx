import { useEffect, useState } from 'react'

function App() {

  const [location, setLocation] = useState(null)
  const [temp, setTemp] = useState(null)
  const [icon, setIcon] = useState(null)
  const [info, setInfo] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [condition, setCondition] = useState(null)
  const [feelsLikeF, setFeelsLikeF] = useState(null)
  const [feelsLikeC, setFeelsLikeC] = useState(null)


  function fetchWeather(location) {
    return new Promise((resolve, reject) => {
      if(typeof(location) === 'number') {
        reject('Error. Numeric inputs are invalid.')
      }
      else {
        resolve(`https://api.weatherapi.com/v1/current.json?key=b396eb0df920407c88b194545232607&q=${location}&aqi=no`
        )
      }
    })
  }

  async function getWeather(e) {
    try{
      e.preventDefault()
      setSubmitted(true)
      const response = await fetchWeather(e.target.location.value)
      const response2 = await fetch(response, {mode: 'cors'})
      const r3 = await response2.json()
      setFeelsLikeF(r3.current.feelslike_f)
      setFeelsLikeC(r3.current.feelslike_c)
      const information = {
        feels_like: `Feels like ${r3.current.feelslike_f}°F`,
        wind: `Wind: ${r3.current.wind_mph} mph`,
        humidity: `Humidity: ${r3.current.humidity}%`,
        tempMode: 'F'
      }
      if(information.tempMode == 'F') {
        setTemp(r3.current.temp_f)
      }
      else {
        setTemp(r3.current.temp_c)
      }
      setInfo(information)
      setCondition(r3.current.condition.text)
      setLocation(r3.location.name)
      setIcon(r3.current.condition.icon)
    }
    catch (err) {
      console.log(err)
    }
  }

  async function changeTempMode() {
    if(info.tempMode == 'F') {
      const updatedInfo = {...info, tempMode: 'C', feels_like: `Feels like ${feelsLikeC}°C`}
      setInfo(updatedInfo)
      let convertedTemp = ((temp-32)*5)/9
      setTemp(Math.round(convertedTemp*10)/10)
    }
    else {
      const updatedInfo = {...info, tempMode: 'F', feels_like: `Feels like ${feelsLikeF}°F`}
      setInfo(updatedInfo)
      let convertedTemp = (temp*(9/5))+32
      setTemp(Math.round(convertedTemp*10)/10)
    }
  }

  return (
    <div className='parent-container'>
      <button className='toggleTempBtn' onClick={()=>changeTempMode()}>{info.tempMode == 'F' ? 'Farenheit' : 'Celcius'}</button>
      <form onSubmit={getWeather}>
        <input name='location' type='text' placeholder='Enter a location...'></input>
      </form>
      {
        submitted
        ? <div className='weather-container'>
            <h2>{location}</h2>
            <div className='info-container'>
              <div className='primary-info-container'>
                <img src={icon}></img>
                <h3>{temp}°{info.tempMode == 'F' ? 'F' : 'C'}</h3>
                <p>{condition}</p>
              </div>
              <div className='secondary-info-container'>
                {Object.values(info).filter(v => v !== 'F' && v !== 'C').map(v => <p>{v}</p>)}
              </div>
            </div>
      </div>
      : null
      }
    </div>
  )
}

export default App
