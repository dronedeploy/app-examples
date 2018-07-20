const dronedeploy = new DroneDeploy({version: 1});
const controls = {
  url: '#url',
  loading: '#loading-page'
}
const FUNCTION_NAME = "ifttt-webhook";
const functionPaths = {
  store: 'store' 
}

function getEnteredUrl() {
  const select = document.querySelector(controls.url);
  return select.value;
}

async function onSave() {
  const iftttUrl = getEnteredUrl();
}

async function callStoreFunction(options) {
  const api = await dronedeploy;
  const functionUrl = await api.Functions.getUrl(FUNCTION_NAME);
  const token = await api.Authorization.getScopedToken();
  options.headers = {
    'Authorization': `Bearer ${token}`
  }
  return fetch(`${functionUrl}/${functionPaths.store}`, options);
}

async function storeUrl(url) {
  const options = {
    method: "POST",
    body: JSON.stringify({
      endpoint: iftttUrl
    })
  }
  const response = await callStoreFunction(options);

}

async function getStoredUrl() {
  const options = {};
  const response = await callStoreFunction(options);
  console.log(response.status);
}