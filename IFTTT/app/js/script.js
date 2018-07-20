const dronedeploy = new DroneDeploy({version: 1});
const FUNCTION_NAME = "ifttt-webhook";
const functionPaths = {
  store: 'store' 
}

async function onSave() {
  const iftttUrl = getUrl();
  const response = await setStoredUrl(iftttUrl);
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

async function setStoredUrl(url) {
  const options = {
    method: "POST",
    body: JSON.stringify({
      endpoint: url
    })
  }
  return await callStoreFunction(options);
}

async function getStoredUrl() {
  const options = {};
  return await callStoreFunction(options);
}

async function onExpand() {
  show(controls.loadingPage);
  let response = await getStoredUrl();
  if (response.status == 200) {
    const url = await response.text();
    console.log(url);
    setUrl(url);
  } else {
    console.log('response from datastore: ' + response.status);
  }
  hide(controls.loadingPage);
  show(controls.dataPage);
}

/**
 * UI Controls
 */
let isExpanded = false;
const upArrow = 'https://s3.amazonaws.com/drone-deploy-plugins/templates/login-example-imgs/arrow-up.svg';
const downArrow = 'https://s3.amazonaws.com/drone-deploy-plugins/templates/login-example-imgs/arrow-down.svg';
const expandArrow = document.querySelector('.expand-arrow');
const expandBody = document.querySelector('.expand-section');
const expandRow = document.querySelector('.expand-row');
const controls = {
  url: '#url',
  loadingPage: '#loading-page',
  dataPage: '#data-page'
}

expandRow.addEventListener('click', function() {
  isExpanded = !isExpanded
  if (isExpanded){
    expandArrow.src = upArrow;
    expandBody.style.display = 'block';
    onExpand();
  } else{
    expandArrow.src = downArrow;
    expandBody.style.display = 'none';
    onCollapse();
  }
});

function onCollapse() {
  hide(controls.loadingPage);
  hide(controls.dataPage);
}

function getUrl() {
  const select = document.querySelector(controls.url);
  return select.value;
}

function setUrl(url) {
  const select = document.querySelector(controls.url);
  select.value = url;
  Materialize.updateTextFields();
}

function setElementsDisplay(display, ...selectors) {
  selectors.forEach((selector) => document.querySelector(selector).style.display = display);
}

function show(...selectors) {
  setElementsDisplay('', ...selectors);
}

function hide(...selectors) {
  setElementsDisplay('none', ...selectors);
}