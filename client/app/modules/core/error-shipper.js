'use strict';


var mhErrorShipper = angular.module('mhErrorShipper', []);

var execeptionProvider = {
  $get: (exceptionLoggingService) => exceptionLoggingService
};

var exceptionLoggingService = ($log, $window) => {
  function log(message, cause, stackTrace) {
    try{
      $.ajax({
          type: "POST",
          url: "http://christuszentriert.de:31313/", 
          contentType: "application/json",
          data: angular.toJson({
              url: $window.location.href,
              message: message,
              type: "exception",
              stackTrace: stackTrace,
              cause: ( cause || "")
          }),
          error : (XMLHttpRequest, textStatus, errorThrown) => {
            $log.warn("Error server-side logging failed");
            $log.log(textStatus);
          }
      });
    } catch (loggingError) {
      $log.warn("Error server-side logging failed");
      $log.log(loggingError);
    }
  }
  
  return (exception, cause) => {
    $log.error.apply($log, arguments);
    StackTrace.fromError(exception).then((stack) => {
      log(exception.toString(), cause, stack);
    }).catch(() => {
      log(exception.toString(), cause, "");
    });
  };
};

mhErrorShipper.factory('exceptionLoggingService', exceptionLoggingService);
mhErrorShipper.provider('$exceptionHandler', execeptionProvider);
