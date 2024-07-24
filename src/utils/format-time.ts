import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function YMD(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'yyyy-MM-dd';

  try {
    if (date) {
      const formattedDate = format(new Date(date), fm);
      return formattedDate;
    }
  } catch (error) {
    console.error('Invalid date format:', error);
  }

  return '';
  // return date ? format(new Date(date), fm) : '';
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}

export function formatMilitaryTime(militaryTime: string) {
  // Extract hours and minutes
  let hours = parseInt(militaryTime?.substring(0, 2));
  let minutes = militaryTime?.substring(3, 5);

  // Determine AM/PM and adjust hours accordingly
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (00:00) as 12:00 AM

  // Pad single digit hours with leading zero
  hours = hours < 10 ? '0' + hours : hours;

  // Return formatted time
  return hours + ':' + minutes + ' ' + ampm;
}

export function formatClinicTime(dates: any) {
  const date = new Date(dates)

  const hours = date?.getHours().toString().padStart(2, '0');
  const minutes = date?.getMinutes().toString().padStart(2, '0');
  const seconds = date?.getSeconds().toString().padStart(2, '0');


  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

export function convertTimeFormat(timeString: string) {
  // Split the time string into hours and minutes
  var timeParts = timeString.split(':');

  // Extract hours and minutes
  var hours = parseInt(timeParts[0], 10);
  var minutes = parseInt(timeParts[1], 10);

  // Construct a Date object with the given time values
  var time = new Date();
  time.setHours(hours);
  time.setMinutes(minutes);

  // Format the time as HH:MM AM/PM
  var formattedTime = time.toLocaleTimeString('en-PH', { hour12: true });

  return formattedTime;
}

export function getDateSpan(dateString: string) {
  // Your date string
  // const dateString = '2024-07-04T06:18:35.441Z';

  // Parse the date string into a Date object
  const dateCreated = new Date(dateString);

  // Get the current date/time
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceMs = currentDate - dateCreated;

  // Convert milliseconds to seconds, minutes, hours, days, etc.
  // Example: Convert milliseconds to seconds
  // const differenceSeconds = Math.floor(differenceMs / 1000);

  // Example: Convert milliseconds to minutes
  // const differenceMinutes = Math.floor(differenceMs / (1000 * 60));

  // Example: Convert milliseconds to hours
  const differenceHours = Math.floor(differenceMs / (1000 * 60 * 60));

  // Example: Convert milliseconds to days
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  // Output the differences
  // console.log(`Difference in seconds: ${differenceSeconds}`);
  // console.log(`Difference in minutes: ${differenceMinutes}`);
  // console.log(`Difference in hours: ${differenceHours}`);
  // console.log(`Difference in days: ${differenceDays}`);

  console.log(differenceDays, differenceHours,'DIFFERENCE____________')
  return (()=>{
    return differenceHours >= 24 ? `${differenceDays} ${differenceDays > 1 ? 'days ago':'day ago'}` : `${differenceHours} ${differenceHours > 1 ? 'hours ago':'hour ago'} `
  })()

}