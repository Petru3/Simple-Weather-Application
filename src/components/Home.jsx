import React, { useEffect, useState } from 'react';
import sunnyIcon from '../Assets/sunny-icon-17.png';

const KEY = 'FAHFSD8SKYCU2ERYKPE42VWXH';

export default function Home() {
    const [query, setQuery] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [resolvedAddress, setResolvedAddress] = useState(null);
    const [errorLocation, setErrorLocation] = useState(null);

    useEffect(() => {
        async function fetchWeatherAndLocation() {
            if (!query) return;

            try {
                // Fetch weather data
                const weatherRes = await fetch(
                    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=metric&key=${KEY}&contentType=json`
                );
                if (!weatherRes.ok) {
                    throw new Error('Weather data not found');
                }
                const weatherData = await weatherRes.json();
                if (weatherData && weatherData.days && weatherData.days.length > 0) {
                    setWeatherData(weatherData.days[0]);
                    setError(null);
                } else {
                    setError('No weather data available');
                    setWeatherData(null);
                }

                // Fetch location data
                const locationRes = await fetch(
                    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=metric&key=${KEY}&contentType=json`
                );
                if (!locationRes.ok) {
                    throw new Error('Location data not found');
                }
                const locationData = await locationRes.json();
                if (locationData && locationData.resolvedAddress) {
                    setResolvedAddress(locationData.resolvedAddress);
                    setErrorLocation(null);
                } else {
                    setErrorLocation('No location available');
                    setResolvedAddress(null);
                }
            } catch (error) {
                setError('An error occurred. Please try again.');
                setWeatherData(null);
                setErrorLocation('An error occurred. Please try again.');
                setResolvedAddress(null);
            }
        }

        fetchWeatherAndLocation();
    }, [query]);

    const {
        datetime,
        tempmax,
        tempmin,
        feelslike,
        humidity,
        windspeed,
        conditions,
    } = weatherData || {};

    function handleSearch() {
        if (query.trim() !== '') {
            const encodedQuery = encodeURIComponent(query.trim());
            setQuery(encodedQuery);
        }
    }

    return (
        <>
            <div className='header'>
                <h1>Weather App</h1>
                <img src={sunnyIcon} alt="Weather Icon" />
            </div>
            <div className='home-page'>
                <Section className={'left-section'}>
                    <div className='name'>{}</div>
                    <div className="day">{datetime}</div>
                    <div className="temperature">{tempmax} °C</div>
                    <div className="description">{conditions}</div>
                </Section>

                <Section className={'right-section'}>
                    <Search
                        query={query}
                        setQuery={setQuery}
                        onSearch={handleSearch}
                    />
                    <Location
                        resolvedAddress={resolvedAddress}
                    />

                    <Temps
                        maxTemp={tempmax}
                        minTemp={tempmin}
                    />

                    <AdditionalInfos
                        feels={feelslike}
                        humidity={humidity}
                        wind={windspeed}
                    />
                </Section>
                {error && <p>{error}</p>}
                {errorLocation && <p>{errorLocation}</p>}
            </div>
        </>
    )
}

function AdditionalInfos({ feels, humidity, wind }) {
    return (
        <>
            <div className="feels-like">
                <span className="label">Feels Like:</span>
                <span className="value"> {feels} °C</span>
            </div>
            <div className="humidity">
                <span className="label">Humidity:</span>
                <span className="value"> {humidity}%</span>
            </div>
            <div className="wind">
                <span className="label">Wind:</span>
                <span className="value"> {wind} m/s</span>
            </div>
        </>
    )
}

function Temps({ maxTemp, minTemp }) {
    return (
        <div className="temperature-details">
            <MaxTemp maxTemp={maxTemp} />
            <MinTemp minTemp={minTemp} />  
        </div>
    )
}

function MaxTemp({ maxTemp }) {
    return (
        <div className="max-temp">
            <span className="label">Max temperature:</span>
            <span className="value"> {maxTemp} °C</span>
        </div>
    )
}

function MinTemp({ minTemp }) {
    return (
        <div className="min-temp">
            <span className="label">Min temperature:</span>
            <span className="value"> {minTemp} °C</span>
        </div>
    )
}

function Search({ query, setQuery }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search Location ..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
        </div>
    )
}

function Location({ resolvedAddress }) {
    return (
        <div className="location">
            <p>Location: {resolvedAddress ? resolvedAddress : 'Unknown'}</p>
        </div>
    )
}

function Section({ children, className }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}
