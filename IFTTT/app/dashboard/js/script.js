//Initialize the DroneDeploy API
const dronedeploy = new DroneDeploy({version: 1});

/**
 * Sets the data value to the DroneDeploy Datastore
 */
async function onSave() {
  disableSaveButton();
  hideAllPages();
  show(controls.loadingPage);
  let token = await getJwtToken();
  setData(token);
  hide(controls.loadingPage);
  show(controls.dataPage);
  resetSaveButton();
}

async function getJwtToken() {
  const api = await dronedeploy;

  // Grabs the data of the function to call by name of function
  const token = await api.Authorization.getScopedToken();
  return token;
}

/**
 * Actions to take when a user expands the app
 * 1. Show the loading page
 * 2. Query DroneDeploy Datastore for the stored data
 * 3. Handle UI depending on response code
 */
async function onExpand() {
  hideAllPages();
  show(controls.loadingPage);
  let token = await getJwtToken();
  setData(token);
  hide(controls.loadingPage);
  show(controls.dataPage);
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
  data: '#data',
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

function getData() {
  const select = document.querySelector(controls.data);
  return select.value;
}

function setData(data) {
  const select = document.querySelector(controls.data);
  select.value = data;
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
  setElementsInnerHtml('Generating', controls.saveButton);
  document.querySelector(controls.saveButton).disabled = true;
}

function resetSaveButton() {
  setElementsInnerHtml('Generate', controls.saveButton);
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