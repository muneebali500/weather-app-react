import { formatTimestamp } from "../utils/helpers";

export default function WeatherSummary({ item, slide }) {
  return (
    <li
      className={`min-w-[calc(50%-6px)] md:min-w-[calc(25%-9px)] bg-primary rounded-xl p-3 flex flex-col items-center`}
    >
      <p className="text-sm mb-3">
        <span className="mr-2">{formatTimestamp(item.dt).day}</span>
        {slide && (
          <span className="uppercase text-grey_2">
            {formatTimestamp(item.dt).time} {formatTimestamp(item.dt).unit}
          </span>
        )}
      </p>

      <figure className="flex-1 flex items-center">
        <img
          src={`/images/${item.weather[0].icon}.png`}
          alt="Cloud"
          loading="lazy"
          className="w-20 mb-2"
        />
      </figure>

      <p className="text-grey_2 text-xs mb-2">{item.weather[0].description}</p>

      <p className="">
        <span className="text-sm mr-2">{item.main.temp}°</span>
        {!slide && (
          <span className="text-sm text-grey_2">{item.main.feels_like}°</span>
        )}
      </p>
    </li>
  );
}
