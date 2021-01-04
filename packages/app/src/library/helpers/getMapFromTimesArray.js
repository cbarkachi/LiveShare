import days from "library/constants/days";

export default function getMapFromTimesArray(times) {
  const timesMap = {};
  for (let i = 0; i < days.length; i++) {
    timesMap[days[i]] = times[i];
  }
  return timesMap;
}
