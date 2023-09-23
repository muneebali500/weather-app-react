import React from "react";
import { formatTimestamp } from "../utils/helpers";

export default function WeatherDetails({ state, title, imgName, value, unit }) {
  return (
    <li className="min-w-[calc(50%-6px)] md:min-w-[calc(33%-6px)] bg-primary rounded-xl p-3 flex flex-col items-center justify-center">
      {state?.length ? (
        <ul className="flex flex-col gap-4">
          {state.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <img
                src={`/images/${item.imgName}.png`}
                alt={item.imgName}
                loading="lazy"
                className="w-9"
              />
              <p className="text-xs flex flex-col">
                <span className="">
                  {formatTimestamp(item.value).time}{" "}
                  {formatTimestamp(item.value).unit}
                </span>{" "}
                <span className="text-grey_2">{item.title}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p className="text-sm mb-3">
            <span className="mr-2 capitalize">{title}</span>
          </p>

          <figure className="flex-1 flex items-center">
            <img
              src={`/images/${imgName}.png`}
              alt={imgName}
              loading="lazy"
              className="w-20 mb-2"
            />
          </figure>

          <p className="">
            <span className="text-sm mr-1">{value}</span>
            <span className="text-grey_2 text-[9px]">{unit}</span>
          </p>
        </>
      )}
    </li>
  );
}
