// Notes of a few examples of NMEA-183 Decimal degrees to latitude longitude converters


/* ============================================== \
#													#
#	Simple Converter from NMEA to Decimal			#
#	from:											#
#	http://www.hiddenvision.co.uk/ez/				#
#													#
 \ ============================================== */

  function makelink() {
   $("link").innerHTML = '';
   x_lat=$('dec_lat').value; //.replace(",",".");
   x_lon=$('dec_lon').value; //.replace(",",".");
   if (x_lat != false) {
    if (x_lon != false) {
     $("link").innerHTML = 'View on: <a href="http://maps.google.co.uk/maps?f=q&hl=en&q=' + x_lat + ',' + x_lon + '" target="_blank">Google Maps</a>';
   //$("link").innerHTML += ' | <a href="http://www.multimap.com/maps/#t=l&map=' + x_lat + ',' + x_lon + '|14|4&loc=GB:' + x_lat + ':' + x_lon + ':16|' + x_lat + ',' + x_lon + '|Lat:%20' + x_lat + ',%20Lon:%20' + x_lon + '" target="_blank">Multimap</a>';
     $("link").innerHTML += ' | <a href="http://www.bing.com/maps/?v=2&where1=' + x_lat + ',%20' + x_lon + '&q=' + x_lat + '%20' + x_lon + '&cp=' + x_lat + '%7E' + x_lon + '&lvl=11&sty=c&encType=1" target="_blank">Bing Maps</a>';
    }
   }
  }
  function frmsubmit(xoigin) {
   frmclear(xoigin);
   //makelink();
  }
  function frmclear(xoigin) {
   //$("link").innerHTML = '';
  }
  function frmerase() {
   //$("link").value='';
   $("nmea_lat").value='';
   $("nmea_lon").value='';
   $("dms_lat").value='';
   $("dms_lon").value='';
   $("dec_lat").value='';
   $("dec_lon").value='';
  }

  function $(element) {
   var elementobj = document.getElementById(element);
   return elementobj;
  }
 
 /* =============================================== \
#													#
#	Next Sample										#
#	Source URL:										#
#													#
\ =============================================== */
