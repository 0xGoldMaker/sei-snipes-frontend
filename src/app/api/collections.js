export default async function handler(req, res) {
  try {
    var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("https://app.seisaw.xyz/api/collections", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

  } catch (error) {
    console.log(error);
  }
}
