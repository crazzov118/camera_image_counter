<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <![endif]-->
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title></title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"
    />

    <link
      href="https://getbootstrap.com/docs/5.2/assets/css/docs.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="./assets/styles/style.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  </head>
  <body>
    <!--[if lt IE 7]>
      <p class="browsehappy">
        You are using an <strong>outdated</strong> browser. Please
        <a href="#">upgrade your browser</a> to improve your experience.
      </p>
    <![endif]-->
    <div class="bg-light px-2 py-4" style="width: 100vw; height: 100vh">
      <div
        class="bd-gray-100 p-4 w-75 h-100 mx-auto"
        style="background-color: #e7e9eb"
      >
        <div class="bg-black p-4 w-100 h-100">
          <div class="bg-light p-4 w-100 h-100 position-relative">
            <div class="toolbar position-absolute" style="top: 1vh; right: 1vw">
              <div>
                <a
                  class="btn btn-sm btn-outline"
                  data-bs-toggle="modal"
                  data-bs-target="#camera-settings-modal"
                >
                  <i class="bi bi-gear p-2 h2"></i>
                </a>
              </div>
            </div>
            <div class="row">
              <p style="font-size: min(8vh, 6vw); margin: 6vh">CURRENT COUNT</p>
            </div>
            <div class="row">
              <div class="col-md-7">
                <div class="d-flex justify-content-center">
                  <span
                    class="text-danger"
                    style="font-size: 18vh"
                    id="count-display-div"
                    >0
                  </span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-7">
                <div
                  class="d-flex w-100 h-100 justify-content-center align-items-center"
                >
                  <div class="row">
                    <div class="col d-flex align-items-center">
                      <select
                        id="camera-select"
                        type="text"
                        class="form-control form-select ms-2 form-control-sm"
                        style="width:10vw"
                        data-placeholder="Select a camera"
                      ></select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-5 text-center">
                <button
                  class="btn btn-success text-dark bd-green-500 px-4 fw-medium"
                  style="
                    font-size: 4vh;
                    letter-spacing: 2px;
                    border-radius: 10px;
                    border-width: 3px;
                    background-color: rgb(146, 209, 78);
                  "
                  onclick="resetTime()"
                >
                  RESET
                </button>
              </div>
            </div>
            <!-- <div class="w-100 text-center"></div> -->
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal"
      tabindex="-1"
      id="camera-settings-modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header px-3 py-1">
            <i class="bi bi-gear h5 me-3"></i>
            <h5 class="modal-title">Camera Setting</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3 row">
              <label for="server-id-input" class="col-sm-5 col-form-label"
                >Server ID</label
              >
              <div class="col-sm-7">
                <input type="hidden" id="camera-id-input" />
                <input type="text" class="form-control" id="server-id-input" />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="server-ip-input" class="col-sm-5 col-form-label"
                >Server IP address</label
              >
              <div class="col-sm-7">
                <input type="text" class="form-control" id="server-ip-input" />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="camera-name-input" class="col-sm-5 col-form-label"
                >Camera name</label
              >
              <div class="col-sm-7">
                <input
                  type="text"
                  class="form-control"
                  id="camera-name-input"
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="user-name-input" class="col-sm-5 col-form-label"
                >User name</label
              >
              <div class="col-sm-7">
                <input type="text" class="form-control" id="user-name-input" />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="password-input" class="col-sm-5 col-form-label"
                >Password</label
              >
              <div class="col-sm-7">
                <input
                  type="password"
                  class="form-control"
                  id="password-input"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer p-1">
            <button
              type="button"
              class="btn btn-sm btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-sm btn-success"
              onclick="saveSetting()"
            >
              Save
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              onclick="onNew()"
            >
              New
            </button>
          </div>
        </div>
      </div>
    </div>
    <script src="" async defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
    <script src="./assets/scripts/index.js"></script>
  </body>
</html>
