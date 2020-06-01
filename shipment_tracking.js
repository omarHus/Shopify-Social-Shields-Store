function getTrackingDetails() {
    
    // Configure Api keys
    var username = config.USERNAME;
    var password = config.PASSWORD;
    var options  = {};
    options.headers = {"Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)};
    
    // get order information
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();;
    var data  = sheet.getDataRange().getValues();
    
    // loop through tracking numbers
    for (var i = 2; i < data.length; i++ ) {
      
        // organize data into rows
      var row = data[i];
      
      // Search tracking if tracking exists and order is not yet delivered
      if (row[1] != '' && row[3] == ''){
      
        // Put tracking number in request url to Canada Post
        requestString = 'https://soa-gw.canadapost.ca/vis/track/pin/' + row[1] + '/summary';
        
        try {
          // Make GET request
          var xml = UrlFetchApp.fetch(requestString, options).getContentText();
          
          // Parse the returned xml
          var document  = XmlService.parse(xml);
          var root      = document.getRootElement();
          var namespace = XmlService.getNamespace('http://www.canadapost.ca/ws/track');
          var elems     = root.getChildren('pin-summary',namespace)
          
          // Get the estimated arrival date and arrival status
          var estimatedArrival = elems[0].getChild('expected-delivery-date', namespace).getText();
          var arrivalStatus    = elems[0].getChild('actual-delivery-date', namespace).getText();
          
          // Update Shipping details in the sheet
          if (row[2] == '' || row[2] == 'Pending') {
              sheet.getRange(i+1,3).setValue(estimatedArrival);
          }
          // Show delivery status
          if (arrivalStatus != '') {
            arrivalStatus = 'Delivered';
            sheet.getRange(i+1,4).setValue(arrivalStatus);
          }
          
        } catch (error) {
          // handle error if tracking number is not found
          sheet.getRange(i+1,5).setValue(error);
          sheet.getRange(i+1,3).setValue('Pending');
        }
  
      }
  
    }
  }
  