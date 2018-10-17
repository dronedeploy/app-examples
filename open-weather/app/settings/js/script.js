//Initialize the DroneDeploy API
const dronedeploy = new DroneDeploy({version: 1});

// Name of the function to call. Name should be the same set in serverless.yml
const FUNCTION_NAME = "api";
const functionPaths = {
  store: 'store' 
}

/**
 * Sets the input value to the DroneDeploy Datastore
 */
async function onSave() {
  disableSaveButton();
  const input = getInput();
  let response = await setStoredInput(input);
  const status = response.status;
  const text = await response.text();
  console.log(status);
  if (status != 200) {
    console.log(`response from datastore | status: ${status}, message: ${text}`);
    let errorMessage = `An error occurred, please try again. <br> Error message: ${text}`;
    hide(controls.dataPage);
    hide(controls.loadingPage);
    setErrorMessage(errorMessage);
    show(controls.errorPage);
  } else {
    showDataPageMessage(controls.dataMessage, 'input was successfully saved.');
  }
  resetSaveButton();
}

/**
 * Generic function for calling out to Datastore
 */
async function callStoreFunction(options) {
  const api = await dronedeploy;

  // Grabs the URL of the function to call by name of function
  const functionUrl = await api.Functions.getUrl(FUNCTION_NAME);
  
  // Get a token to ensure auth when calling your function
  const token = await api.Authorization.getScopedToken();
  console.log(token);
  options.headers = {
    'Authorization': `Bearer ${token}`
  }
  return fetch(`${functionUrl}/${functionPaths.store}`, options);
}

/**
 * Sets the input value to the DroneDeploy Datastore
 */
async function setStoredInput(input) {
  const options = {
    method: "POST",
    body: JSON.stringify({
      key: input
    })
  }
  return await callStoreFunction(options);
}

/**
 * Retrives the stored input value if any
 */
async function getStoredInput() {
  const options = {};
  return await callStoreFunction(options);
}

/**
 * Actions to take when a user expands the app
 * 1. Show the loading page
 * 2. Query DroneDeploy Datastore for the stored input
 * 3. Handle UI depending on response code
 */
async function onExpand() {
  hideAllPages();
  show(controls.loadingPage);
  let response = await getStoredInput();
  const status = response.status;
  const text = await response.text();
  console.log('text: ' + text);
  if (status == 200) {
    setInput(text);
    hide(controls.loadingPage);
    show(controls.dataPage);
  } else if (status == 204) {
    console.log('no data in datastore');
    hide(controls.loadingPage);
    show(controls.dataPage);
  } else {
    console.log(`response from datastore | status: ${status}, message: ${text}`);
    let errorMessage = `An error occurred, please try again. <br> Error message: ${text}`;
    hide(controls.loadingPage);
    setErrorMessage(errorMessage);
    show(controls.errorPage);
  }
}

/**
 * ----------------------------------- UI Controls ------------------------------------------------
 */
let isExpanded = false;
const upArrow = 'https://s3.amazonaws.com/drone-deploy-plugins/templates/login-example-imgs/arrow-up.svg';
const downArrow = 'https://s3.amazonaws.com/drone-deploy-plugins/templates/login-example-imgs/arrow-down.svg';
const expandArrow = document.querySelector('.expand-arrow');
const expandBody = document.querySelector('.expand-section');
const expandRow = document.querySelector('.expand-row');
const controls = {
  input: '#input',
  loadingPage: '#loading-page',
  dataPage: '#data-page',
  dataMessage: '#data-message',
  errorPage: '#error-page',
  errorMessage: '#error-message',
  saveButton: '#save-button'
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

function getInput() {
  const select = document.querySelector(controls.input);
  return select.value;
}

function setInput(input) {
  const select = document.querySelector(controls.input);
  select.value = input;
  Materialize.updateTextFields();
}

function setElementsDisplay(display, ...selectors) {
  selectors.forEach((selector) => document.querySelector(selector).style.display = display);
}

function setElementsInnerHtml(value, ...selectors) {
  selectors.forEach((selector) => document.querySelector(selector).innerHTML = value);
}

function setErrorMessage(errorMessage) {
  setElementsInnerHtml(errorMessage, controls.errorMessage);
}

function disableSaveButton() {
  setElementsInnerHtml('Saving', controls.saveButton);
  document.querySelector(controls.saveButton).disabled = true;
}

function resetSaveButton() {
  setElementsInnerHtml('Save', controls.saveButton);
  document.querySelector(controls.saveButton).disabled = false;
}

function showDataPageMessage(selector, message) {
  document.querySelector(selector).innerHTML = message;
  document.querySelector(selector).style.display = '';
  setTimeout(() => {
    document.querySelector(selector).style.display = 'none';
  }, 3000);
}

function show(...selectors) {
  setElementsDisplay('', ...selectors);
}

function hide(...selectors) {
  setElementsDisplay('none', ...selectors);
}

function hideAllPages() {
  setElementsDisplay('none', '.page');
}