export function getOSName() {
  let OSName = 'Unknown';
  if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) OSName = 'Windows 10';
  if (window.navigator.userAgent.indexOf('Windows NT 6.2') !== -1) OSName = 'Windows 8';
  if (window.navigator.userAgent.indexOf('Windows NT 6.1') !== -1) OSName = 'Windows 7';
  if (window.navigator.userAgent.indexOf('Windows NT 6.0') !== -1) OSName = 'Windows Vista';
  if (window.navigator.userAgent.indexOf('Windows NT 5.1') !== -1) OSName = 'Windows XP';
  if (window.navigator.userAgent.indexOf('Windows NT 5.0') !== -1) OSName = 'Windows 2000';
  if (window.navigator.userAgent.indexOf('Mac') !== -1) OSName = 'Mac/iOS';
  if (window.navigator.userAgent.indexOf('X11') !== -1) OSName = 'UNIX';
  if (window.navigator.userAgent.indexOf('Linux') !== -1) OSName = 'Linux';

  return OSName;
}

export function getBrowser() {
  let browser_name = '';
  let isIE = /*@cc_on!@*/ false || !!document.documentMode;
  let isEdge = !isIE && !!window.StyleMedia;
  if (navigator.userAgent.indexOf('Chrome') !== -1 && !isEdge) {
    browser_name = 'Chrome';
  } else if (navigator.userAgent.indexOf('Safari') !== -1 && !isEdge) {
    browser_name = 'Safari';
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    browser_name = 'Firefox';
  } else if (navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode === true) {
    //IF IE > 10
    browser_name = 'IE';
  } else if (isEdge) {
    browser_name = 'Edge';
  } else {
    browser_name = 'Unknown';
  }

  return browser_name;
}

export function catchPaste(evt, elem, callback) {
  if (evt.originalEvent && evt.originalEvent.clipboardData) {
    // OriginalEvent is a property from jQuery, normalizing the event object
    callback(evt.originalEvent.clipboardData.getData('text'));
  } else if (evt.clipboardData) {
    // used in some browsers for clipboardData
    callback(evt.clipboardData.getData('text/plain'));
  } else if (window.clipboardData) {
    // Older clipboardData version for Internet Explorer only
    callback(window.clipboardData.getData('Text'));
  } else {
    // Last resort fallback, using a timer
    setTimeout(function () {
      callback(elem.value)
    }, 100);
  }
}

export function getCookie(name) {

  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

// уcтанавливает cookie
export function setCookie(name, value, props) {

  props = props || {}

  var exp = props.expires

  if (typeof exp == "number" && exp) {

      var d = new Date()

      d.setTime(d.getTime() + exp*1000)

      exp = props.expires = d

  }

  if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }

  value = encodeURIComponent(value)

  var updatedCookie = name + "=" + value

  for(var propName in props){

      updatedCookie += "; " + propName

      var propValue = props[propName]

      if(propValue !== true){ updatedCookie += "=" + propValue }
  }

  document.cookie = updatedCookie

}

// удаляет cookie
export function deleteCookie(name) {

  setCookie(name, null, { expires: -1 })

}