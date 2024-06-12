import NepaliDate from "nepali-date-converter";

export function getNepaliDate() {
  // Get the current day date will be converted to Nepali date
  const nepaliDateObj = new NepaliDate();
  let nepaliMonth = nepaliDateObj.getMonth() + 1;
  let nepaliDateString =
    nepaliDateObj.getYear() +
    "-" +
    (nepaliMonth < 10 ? "0" + nepaliMonth : nepaliMonth) +
    "-" +
    nepaliDateObj.getDate();
  return nepaliDateString;
}
export function getNepaliYear() {
  // Get the current day date will be converted to Nepali date
  const nepaliDateObj = new NepaliDate();
  return nepaliDateObj.getYear().toString();
}
export function getNepaliMonth() {
  // Get the current day date will be converted to Nepali date
  const nepaliDateObj = new NepaliDate();
  let nepaliMonth = nepaliDateObj.getMonth() + 1;
  return nepaliMonth < 10 ? "0" + nepaliMonth : nepaliMonth;
}
export function getNepaliGatey() {
  // Get the current day date will be converted to Nepali date
  const nepaliDateObj = new NepaliDate();
  return nepaliDateObj.getDate().toString();
}
