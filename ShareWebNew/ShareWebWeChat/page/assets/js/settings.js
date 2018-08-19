/**
 * Created by Administrator on 2014/11/4.
 */
//var host = "http://182.254.139.114";
if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}
var host = window.location.origin;
//var host = "http://182.254.208.241:8888";
