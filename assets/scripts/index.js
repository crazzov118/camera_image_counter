const LOCAL_STORAGE_EVENTS_KEY_NAME = "events_data";
const LOCAL_STORAGE_MIN_DATE_KEY_NAME = "date";
const LOCAL_STORAGE_CAMERA_SETTINGS_KEY_NAME = "camera_settings";
const LOCAL_STORAGE_CURRENT_OFFSET_KEY_NAME = "current_offset";
const FILTER_KEY_VALUE = "began";
const MIN_DATE = processISOString(
  new Date("1900.01.01 00:00:00").toISOString()
);

var data;
var timeString;
const count_display_dom = $("#count-display-div");
const camera_settings_modal = new bootstrap.Modal(
  document.getElementById("camera-settings-modal")
);
const camera_id_input = $("#camera-id-input");
const server_id_input = $("#server-id-input");
const server_ip_input = $("#server-ip-input");
const camera_name_input = $("#camera-name-input");
const user_name_input = $("#user-name-input");
const password_input = $("#password-input");
const camera_select = $("#camera-select");

const SERVER_FUNCTION = {
  GET_DATA: 1,
  GET_TIME: 2,
};
const SERVER_URL = "api.php";
const DATA_FETCHING_PERIOD = 10000;
const REGULAR_FETCHING_LIMIT = 500;
var current_setting = {};
var offset = 0;
var limit = 100;
var step = 0;
var getDataTimer;
function init() {
  loadCameraSettings();
  initListeners();
  getTimeAndData();
}

function getUpdatedData() {
  if (!current_setting.server_id) {
    console.log("Target camera setting data is not exist!!!");
    return;
  }
  if (step == 2) {
    limit = 500;
  }

  let currentDate = new Date();
  // currentDate.setDate(1);
  currentDate.setHours(23, 59, 59);
  let current_offset = parseInt(
    localStorage.getItem(LOCAL_STORAGE_CURRENT_OFFSET_KEY_NAME)
  );
  if (!current_offset) current_offset = 0;
  let start_time = localStorage.getItem(LOCAL_STORAGE_MIN_DATE_KEY_NAME);
  if (!start_time) {
    let cDate = new Date();
    cDate.setHours(0, 0, 0);
    localStorage.setItem(
      LOCAL_STORAGE_MIN_DATE_KEY_NAME,
      processISOString(cDate.toISOString())
    );
  }
  const param = {
    setting: JSON.stringify(current_setting),
    function: SERVER_FUNCTION.GET_DATA,
    limit,
    offset: current_offset,
    start_time: localStorage.getItem(LOCAL_STORAGE_MIN_DATE_KEY_NAME),
    end_time: processISOString(currentDate.toISOString()),
  };
  fetch(SERVER_URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(param),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json(); // Parse the JSON data from the response
    })
    .then((response) => {
      let data;
      try {
        data = JSON.parse(response.data);
        console.log(data);
        if (data.events.length > 0) {
          localStorage.setItem(
            LOCAL_STORAGE_CURRENT_OFFSET_KEY_NAME,
            current_offset + data.events.length
          );
        }
        doProcess(data);
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Data fetching failed. Try to get from sample data");
    });
}

function doProcess(processingData) {
  const current_camera_events = saveData(processingData);
  const cnt = getNumberOfValidData(current_camera_events);
  console.log("Current Count is " + cnt);
}

function getNumberOfValidData(processingData) {
  timeString = localStorage.getItem(LOCAL_STORAGE_MIN_DATE_KEY_NAME);
  if (!timeString) timeString = MIN_DATE;
  let cnt;
  if (!processingData.events) cnt = 0;
  else {
    const results = processingData.events.filter(
      (one) => one.alertState === FILTER_KEY_VALUE && one.timestamp > timeString
    );
    console.log("THis is filtered results");
    console.log(results);
    cnt = results.length;
  }
  count_display_dom.html(cnt);
  console.log("Number is " + cnt);
  return cnt;
}

// compare the new data and merge this with currently existing data
function saveData(processingData) {
  const current_camera_id = camera_select.val();
  let allData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY_NAME));
  let current_camera_events;
  let added = false;
  if (!allData) {
    const newData = {
      ...processingData,
      camera_id: current_camera_id,
    };
    localStorage.setItem(
      LOCAL_STORAGE_EVENTS_KEY_NAME,
      JSON.stringify([newData])
    );
    return newData;
  } else
    current_camera_events = allData.filter(
      (one) => one.camera_id == current_camera_id
    );
  let result;
  if (!current_camera_events) {
    result = {
      ...processingData,
      camera_id: current_camera_id,
    };
    allData.push(result);
  } else {
    let newEvents = [...current_camera_events[0].events];
    if (processingData.events) comingData = processingData.events;
    for (one of comingData) {
      const results = current_camera_events[0].events.filter(
        (each) => each.id == one.id
      );
      if (results.length === 0) {
        newEvents.push(one);
        added = true;
      }
    }
    result = { camera_id: current_camera_id, events: newEvents };
    allData = allData.map((one) =>
      one.camera_id == current_camera_id ? result : one
    );
  }
  localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY_NAME, JSON.stringify(allData));
  return result;
}

function resetTime() {
  let currentTime = new Date();
  // currentTime.setDate(1);
  localStorage.setItem(
    LOCAL_STORAGE_MIN_DATE_KEY_NAME,
    processISOString(currentTime.toISOString())
  );
  localStorage.setItem(LOCAL_STORAGE_CURRENT_OFFSET_KEY_NAME, 0);
  getUpdatedData();
}

function saveSetting() {
  const server_id = server_id_input.val().trim();
  const server_ip = server_ip_input.val().trim();
  const camera_name = camera_name_input.val().trim();
  const user_name = user_name_input.val().trim();
  const password = password_input.val().trim();
  const id = camera_id_input.val().trim();
  let setting = {
    server_id,
    server_ip,
    camera_name,
    user_name,
    password,
  };
  if (id != "") setting = { ...setting, id };
  doSaveSetting(setting);
}

function doSaveSetting(setting) {
  var savedSettings = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_CAMERA_SETTINGS_KEY_NAME)
  );
  if (!savedSettings) savedSettings = [];
  if (setting.id)
    savedSettings = savedSettings.map((one) =>
      one.id == setting.id ? setting : one
    );
  else {
    const cnt = savedSettings.length;
    let current_id = cnt == 0 ? 0 : savedSettings[savedSettings.length - 1].id;
    setting = { ...setting, id: current_id + 1 };
    savedSettings.push(setting);
    localStorage.setItem(
      LOCAL_STORAGE_CAMERA_SETTINGS_KEY_NAME,
      JSON.stringify(savedSettings)
    );
    camera_id_input.val(current_id + 1);
    putSettingDataToModal(setting);
    addOptionToCameraSelect(setting);
    camera_select.val(current_id + 1);
    camera_select.change();
    clearInterval(getDataTimer);
  }
  camera_settings_modal.hide();
}

function onNew() {
  camera_id_input.val("");
  server_id_input.val("");
  server_ip_input.val("");
  camera_name_input.val("");
  user_name_input.val("");
  password_input.val("");
}

function loadCameraSettings() {
  // camera_select.select2({
  //   width: "8vw",
  // });
  var settings = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_CAMERA_SETTINGS_KEY_NAME)
  );
  if (!settings) {
    settings = [];
    settings = [
      {
        id: 1,
        server_id: "VA-INTERFLOOR-1",
        server_ip: "192.168.20.34",
        camera_name: "DeviceIpint.1/SourceEndpoint.video:0:0",
        user_name: "root",
        password: "root",
      },
    ];
    // return;
    localStorage.setItem(
      LOCAL_STORAGE_CAMERA_SETTINGS_KEY_NAME,
      JSON.stringify(settings)
    );
  }
  for (let setting of settings) {
    addOptionToCameraSelect(setting);
  }
}

function initListeners() {
  camera_select.on("change", (e) => {
    const id = camera_select.val();
    const settings = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_CAMERA_SETTINGS_KEY_NAME)
    );
    if (!settings) {
      console.log("There is no settings data saved on localStorage");
      return;
    }
    const setting = settings.filter((one) => one.id == id);
    if (!setting || settings.length === 0) {
      console.log("There is no settings saved on localStorage with id " + id);
      return;
    }
    putSettingDataToModal(setting[0]);
    current_setting = {
      ...setting[0],
    };
    getTimeAndData();
  });
  camera_select.change();
}

function putSettingDataToModal(settingData) {
  const { id, server_id, server_ip, camera_name, user_name, password } =
    settingData;
  camera_id_input.val(id);
  server_id_input.val(server_id);
  server_ip_input.val(server_ip);
  camera_name_input.val(camera_name);
  user_name_input.val(user_name);
  password_input.val(password);
}

function addOptionToCameraSelect(settingData) {
  camera_select.append(
    `<option value="${settingData.id}">${settingData.camera_name}</option>`
  );
}

function getTimeAndData() {
  limit = 5000;
  offset = 0;
  step = 1;

  let currentTime = new Date();
  // currentTime.setDate(1);
  const currentTimeString = processISOString(currentTime.toISOString());
  let timeString = localStorage.getItem(LOCAL_STORAGE_MIN_DATE_KEY_NAME);
  if (!timeString) {
    timeString = currentTimeString.split("T")[0] + "T000000";
    localStorage.setItem(LOCAL_STORAGE_MIN_DATE_KEY_NAME, timeString);
  }
  if (timeString.split("T")[0] != currentTimeString.split("T")[0]) {
    // If this is a first visit of this page on a given day
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY_NAME, null);
    const curDateString = currentTimeString.split("T")[0] + "T000000";
    localStorage.setItem(LOCAL_STORAGE_MIN_DATE_KEY_NAME, curDateString);
  }
  getUpdatedData();
  step = 2;

  setTimeout(() => {
    getDataTimer = setInterval(getUpdatedData, DATA_FETCHING_PERIOD);
  }, DATA_FETCHING_PERIOD);
}

function processISOString(str) {
  return str.replace(/-/g, "").replace(/:/g, "").replace("Z", "");
}
init();
