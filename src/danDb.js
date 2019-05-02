const baseApiUrl = "http://dotdb2.eastus.cloudapp.azure.com:8082/api/twitter/";

export const getData = callback => {
  fetch(baseApiUrl + "history")
    .then(res => res.json())
    .then(myJson => callback(myJson))
    .catch(e => console.log(e));
};
