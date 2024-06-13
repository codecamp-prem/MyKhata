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
  return nepaliMonth < 10 ? "0" + nepaliMonth : nepaliMonth.toString();
}
export function getNepaliGatey() {
  // Get the current day date will be converted to Nepali date
  const nepaliDateObj = new NepaliDate();
  return nepaliDateObj.getDate().toString();
}

export function getFullNepaliMonth(strNumericNepaliMonth: string): string {
  const nepaliFullMonthsObj: { [key: string]: string } = {
    "01": "Baisakh",
    "02": "Jestha",
    "03": "Asar",
    "04": "Shrawan",
    "05": "Bhadra",
    "06": "Aswin",
    "07": "Kartik",
    "08": "Mangsir",
    "09": "Poush",
    "10": "Magh",
    "11": "Falgun",
    "12": "Chaitra",
  };
  return nepaliFullMonthsObj[strNumericNepaliMonth];
}
