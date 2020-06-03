import moment from 'moment';
import firebase from 'firebase';

export function convertTimeStampToString(timestamp) {
  const date = timestamp.toDate();
  return moment(date).format('DD/MM/YYYY HH:mm');
}

export function convertStringToTimeStamp(dateString) {
  const date = moment(dateString, 'DD/MM/YYYY HH:mm').toDate();
  const timestamp = firebase.firestore.Timestamp.fromDate(date);
  return timestamp;
}
