import { useQuery } from "react-query";
import Tippy from "@tippyjs/react";

import { fetchGithubEvents, EventsData } from "./fetchers/githubFetchers";

import "./styles/githubContribs.css";
import "tippy.js/dist/tippy.css";

const Contributions = ({ eventsData }: { [key: string]: EventsData[] }) => {
  const year = new Date().getFullYear();
  const dayTodayIndex: number = new Date().getDay();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInYearArray = Array.from({ length: (isLeapYear ? 366 : 365) + dayTodayIndex }, (_, index) => index - dayTodayIndex + 1);
  let weekArraySnippets: number[][] = [];
  for (let i = 0; i < Math.ceil(isLeapYear ? 366 : 365 / 7); i++) {
    weekArraySnippets.push(daysInYearArray.slice(i * 7, (i + 1) * 7));
  }

  const events: { [timestamp: string]: number } = {};
  for (const event of eventsData) {
    const dateString = event.created_at.substring(0, 11);
    events[dateString] = (events[dateString] || 0) + 1;
  }

  return (
    <div className="year-contributions-wrapper">
      <div className="year-contributions-container">
        {weekArraySnippets.map((week, weekIndex) => (
          <div className="year-contributions-week-container" key={weekIndex}>
            {week.map((_, dayIndex) => {
              const date = new Date();
              date.setDate(date.getDate() - (daysInYearArray.length - 1 - (weekIndex * 7 + dayIndex)));
              const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
              const monthName = date.toLocaleDateString(undefined, { month: "long" });
              const dateString = `${dayName}, ${monthName} ${date.getUTCDate()}. ${date.getFullYear()}.`;

              const contributions = events[date.toISOString().substring(0, 11)] || 0;
              let colorClass;
              if (contributions > 9) colorClass = "year-contributions-level-5";
              else if (contributions > 6) colorClass = "year-contributions-level-4";
              else if (contributions > 3) colorClass = "year-contributions-level-3";
              else if (contributions > 0) colorClass = "year-contributions-level-2";
              else colorClass = "year-contributions-level-1";

              return (
                <Tippy content={`${contributions} contributions on ${dateString}`} key={dayIndex}>
                  <div className={`year-contributions-day ${colorClass}`} />
                </Tippy>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DisplayGithubContributions() {
  const {
    isError: isErrorEvents,
    isLoading: isLoadingEvents,
    data: eventsData,
    error: eventsError,
  } = useQuery("repos", fetchGithubEvents, { staleTime: Infinity });

  if (isLoadingEvents) {
    return (
      <div>
        <h1 style={{ color: "white" }}>loading</h1>
      </div>
    );
  } else if (isErrorEvents) {
    console.error(eventsError);
    return (
      <div>
        <h1></h1>
      </div>
    );
  }

  if (eventsData) return <Contributions eventsData={eventsData} />;
}
