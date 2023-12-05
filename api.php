<?php

function get_data()
{
    global $rawPostData;
    $request_data = json_decode($rawPostData);
    $setting = json_decode($request_data->setting, false);
    
    $url = "http://" . $setting->user_name . ":"
        . $setting->password . "@"
        . $setting->server_ip . "/archive/events/detectors/"
        . $setting->server_id . "/"
        . $setting->camera_name . "/"
        . $request_data->start_time . "/"
        . $request_data->end_time . "?limit="
        . $request_data->limit . "&offset="
        . $request_data->offset . "&type=oneLine";

    $response = file_get_contents($url);

    echo json_encode(["data" => $response]);
}

function get_time()
{
    //echo json_encode(["data" => date('Y-m-d\TH:i:sP')]);
    echo json_encode(["data" => time()]);
}

$rawPostData = file_get_contents('php://input');

$function = json_decode($rawPostData)->function;
switch ($function) {
    case 1:
        get_data();
        break;
    case 2:
        get_time();
        break;
    default:
        break;
}
