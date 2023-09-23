//////////// IMPORTING HOOKS
import { useState, useEffect, useRef } from "react";

//////////// IMPORTING THIRD PARTY LIBRARIES
import axios from "axios";

//////////// IMPORTING CUTOM COMPONENTS
import WeatherSummary from "../components/WeatherSummary";
import WeatherDetails from "../components/WeatherDetails";

//////////// IMPORTING HELPERS FUNCTIONS
import { formatTimestamp, isNightTime } from "../utils/helpers";
import Toast from "../components/Toast";

////// GLOBAL VARIABLES
const GEOCODE_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const APIKey = import.meta.env.VITE_WEATHER_API_KEY;

////////////////////////////////// START OF MAIN COMPONENT //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
export default function HomePage() {
  const containerRef = useRef(null);

  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [weekWeatherData, setWeekWeatherData] = useState([]);
  const [dailyWeatherData, setDailyWeatherData] = useState([]);
  const [currentWeatherData, setCurrentWeatherData] = useState({});
  const [weatherHighlights, setWeatherHighlights] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { dt, main, name, sys, weather, wind, clouds } = currentWeatherData;

  console.log({ currentWeatherData });

  //////// useffect runs every time when new city entered as input and set the current day's weather details
  useEffect(() => {
    if (Object.keys(currentWeatherData).length) {
      setWeatherHighlights([
        {
          title: "humidity",
          value: main.humidity,
          unit: "%",
          imgName: "humidity",
        },
        {
          title: "wind speed",
          value: wind.speed,
          unit: "m/s",
          imgName: isNightTime() ? "wind-night" : "wind-day",
        },
        {
          state: [
            { title: "sunrise", value: sys.sunrise, imgName: "sunrise" },
            { title: "sunset", value: sys.sunset, imgName: "sunset" },
          ],
        },
        { title: "clouds", value: clouds.all, unit: "%", imgName: "clouds" },
        { title: "UV index", value: 0, unit: "", imgName: "uv" },
        {
          title: "pressure",
          value: main.pressure,
          unit: "hPa",
          imgName: "pressure",
        },
      ]);
    }
  }, [currentWeatherData]);

  ////// function sends the city input value to get coordinates from API
  function handleSubmit(e) {
    e.preventDefault();

    if (!searchValue) return;

    getCityCoordinates(searchValue.trim());
    setCurrentWeatherData({});
  }

  ////// function fetches city's coordinates from API when user input the city name and submit it
  async function getCityCoordinates(cityName) {
    setIsLoading(true);

    try {
      const { data: cityData } = await axios.get(
        `${GEOCODE_API_URL}?q=${cityName}&appid=${APIKey}`
      );
      const { lat, lon } = cityData[0];

      getWeatherData(lat, lon);
    } catch (error) {
      console.log(error);
      showToastMessage("Something went wrong! Please try again");
    } finally {
      setIsLoading(false);
    }
  }

  ////// function fetches current day's weather details from API and set the states to display on UI
  async function getWeatherData(latitude, longitude) {
    try {
      const { data } =
        await axios.get(`${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}
      `);

      setCurrentWeatherData(data);
      getHourlyAndWeeklyWeather(latitude, longitude);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  ////// function calculates hourly and weekly weather data
  async function getHourlyAndWeeklyWeather(latitude, longitude) {
    try {
      const { data } =
        await axios.get(`${FORECAST_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}
      `);

      const weekForecastDays = [];
      /// filter fetched data to compute 5 days of week's data
      const weekForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!weekForecastDays.includes(forecastDate)) {
          return weekForecastDays.push(forecastDate);
        }
      });

      /// filter data to computer current days hourly weather data
      const dailyForecast = data.list.filter(
        (forecast) =>
          new Date(forecast.dt_txt).getDate() === weekForecastDays[0]
      );

      setWeekWeatherData(weekForecast);
      setDailyWeatherData(dailyForecast);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Function to scroll today's weather cards to the left
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= containerRef.current.offsetWidth + 9;
    }
  };

  // Function to scroll today's weather cards to the right
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += containerRef.current.offsetWidth + 9;
    }
  };

  // function shows message in case data fails to load from API
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setWeekWeatherData([]);
    setDailyWeatherData([]);
    setWeatherHighlights([]);
  };

  /////////////////////////////////////// JSX /////////////////////////////////////////////
  return (
    <main className="flex flex-col lg:flex-row h-screen">
      <Toast
        message={toastMessage}
        showToast={showToast}
        setShowToast={setShowToast}
      />
      {/*--------- left side of dashboard ----------- */}
      <section className="lg:max-w-[350px] flex flex-col items-center lg:items-start bg-primary px-8 py-10">
        <form onSubmit={handleSubmit} className="relative mb-5">
          <button type="button" onClick={handleSubmit}>
            <i className="fa-solid fa-magnifying-glass text-[#909090] absolute top-1/2 left-2 -translate-y-1/2"></i>
          </button>
          <input
            className="bg-secondary text-grey_1 text-sm font-medium capitalize py-2.5 px-9 rounded-md w-full border-none outline-none font-poppins"
            type="text"
            placeholder="Search for Places..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        {Object.keys(currentWeatherData).length > 0 && (
          <>
            <figure className="w-[240px] mb-8">
              <img
                src={`/images/${weather[0].icon}.png`}
                alt=""
                loading="lazy"
                className="h-full w-full"
              />
            </figure>

            <h3 className="font-poppins text-5xl relative">
              {main?.temp}
              <sup className="text-2xl -top-5">°C</sup>
            </h3>
            <p className="font-sm text-grey_2 mb-3">
              Feels like {main.feels_like}
              <sup className="-top-1">°C</sup>
            </p>

            <ul className="">
              <li className="flex items-center justify-center lg:justify-start gap-1 mb-3">
                <img
                  className="w-7"
                  src={`/images/${weather[0].icon}.png`}
                  alt="Cloud"
                  loading="lazy"
                />
                <span className="text-base capitalize">{weather[0].main}</span>
              </li>

              <li className="bg-[#3B435E] h-[1px] mb-3"></li>

              <li className="text-lg mb-3">
                <span className="mr-2">{formatTimestamp(dt).day}</span>
                <span className="uppercase text-grey_2">
                  {formatTimestamp(dt).time} {formatTimestamp(dt).unit}
                </span>
              </li>

              <li className="text-sm text-center lg:text-start">
                <i className="fa-solid fa-location-dot mr-1"></i>
                <span>
                  {name}, {sys.country}
                </span>
              </li>
            </ul>
          </>
        )}
      </section>

      {/* ---------- right side of dashboard (weather details) ---------  */}
      <section className="flex-1 bg-secondary px-[5%] py-10 lg:overflow-auto">
        {isLoading ? (
          <figure className="h-screen flex items-center">
            <img
              className="mx-auto max-w-full"
              src="/images/loader.svg"
              alt="Loading..."
            />
          </figure>
        ) : (
          <>
            {/* SECTION TODAY's WEATEHR */}
            {dailyWeatherData.length > 0 && (
              <section className="mb-5">
                <p className="flex justify-between items-center pt-1.5 mb-5">
                  <span className="text-lg">Today</span>
                  <span className="text-sm bg-[#1a1a1a] p-2 rounded-full">
                    °C
                  </span>
                </p>

                <div className="relative">
                  <ul
                    className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar"
                    ref={containerRef}
                  >
                    {dailyWeatherData.map((item) => (
                      <WeatherSummary
                        key={item.dt_txt}
                        item={item}
                        slide={true}
                      />
                    ))}
                  </ul>

                  <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                    <button
                      type="button"
                      className="ml-2 opacity-50 cursor-pointer"
                      onClick={scrollLeft}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                      type="button"
                      className="mr-2 opacity-50 cursor-pointer"
                      onClick={scrollRight}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION WEATHER HIGHLIGHTS */}
            {weatherHighlights.length > 0 && (
              <section className="mb-5">
                <p className="flex justify-between items-center pt-1.5 mb-5">
                  <span className="text-lg">Today&apos;s Highlights</span>
                </p>

                <div className="relative">
                  <ul className="flex flex-wrap gap-3">
                    {weatherHighlights?.map((item, index) => (
                      <WeatherDetails key={index} {...item} />
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* SECTION THIS WEEK WEATEHR */}
            {weekWeatherData.length > 0 && (
              <section className="mb-5">
                <p className="flex justify-between items-center pt-1.5 mb-5">
                  <span className="text-lg">This Week</span>
                </p>

                <div className="relative">
                  <ul className="flex flex-wrap gap-3 ">
                    {weekWeatherData.map((item) => (
                      <WeatherSummary key={item.dt} item={item} slide={false} />
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
