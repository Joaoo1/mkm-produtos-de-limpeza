import moment from 'moment';
import app from 'firebase/app';
import 'firebase/firestore';

export function convertTimeStampToString(timestamp) {
  const date = timestamp.toDate();
  return moment(date).format('DD/MM/YYYY HH:mm');
}

export function convertDateToString(date) {
  return moment(date).format('DD/MM/YYYY HH:mm');
}

export function convertStringToTimestamp(dateString) {
  const date = moment(dateString, 'DD/MM/YYYY HH:mm').toDate();
  const timestamp = app.firestore.Timestamp.fromDate(date);
  return timestamp;
}
