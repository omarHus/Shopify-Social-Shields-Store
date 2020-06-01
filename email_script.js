function sendShieldEmails() {
    
    // Get email data
    var sheet   = SpreadsheetApp.getActiveSheet();
    var data    = sheet.getDataRange().getValues();
    var subject = data[1][1];
    
    // Get html template for email message
    var templ   = HtmlService.createTemplateFromFile('shieldClientMessage');
    var message = templ.evaluate().getContent();
  
    // loop through email list
    for (var i = 1;i < data.length; i++) {
      var row          = data[i];
      var emailAddress = row[0];
      
      // send emails
      try{ 
        GmailApp.sendEmail(emailAddress, subject, "", {
          from    : 'info@socialshields.ca',
          name    : 'Social Shields Canada',
          htmlBody: message
        });
      } catch (error) { 
        Logger.log(error);
      }
    }
  }