

const MAX_MESSAGE_LENGTH = 200;

const ERROR_PRELOG                = "Error: Following fields are incorrect:";
const ERROR_REQUIRES_STRING       = "Error: Error message needs to be a string.";
const ERROR_BOOLEAN_REQUIRED      = "Error: Boolean required.";
const ERROR_MESSAGE_LENGTH        = "Message missing or exceeds " + MAX_MESSAGE_LENGTH + " characters.";
const ERROR_FORM_TYPE             = "Om du väljer Föreläsning eller Seminar, så måste du ange titel och meddelandet.";
const ERROR_INVALID_MAIL          = "Email missing or invalid.";
const ERROR_FORM_OBJECT_TYPE      = "Error: Form can only add objects of type 'FormElement'.";
const ERROR_TITLE_MISSING         = "Title missing.";
const ERROR_ORGANISATION_MISSING  = "Organisation missing.";
const ERROR_FIRSTNAME_MISSING     = "Firstname missing.";
const ERROR_LASTNAME_MISSING      = "Lastname missing.";
const ERROR_SEMINARLECTURE_REQ    = " requires an non-empty title.";
const ERROR_UNKNOWN               = "Unknown error.";

const TAG_FIRSTNAME          = "field_firstname";
const TAG_LASTNAME           = "field_lastname";
const TAG_ORGANISATION       = "field_organisation";
const TAG_EMAIL              = "field_email";
const TAG_TITLE              = "field_pres_title";
const TAG_MESSAGE            = "field_message";
const TAG_SELECTED_LECTURE   = "pres_type_1";
const TAG_SELECTED_SEMINAR   = "pres_type_2";
const TAG_SELECTED_DISUSSION = "pres_type_3";


const form = new Form();
      form.init();

window.onload = function() {
  var form_ = document.getElementById('registration_form');
  if (form_.attachEvent) {
      form_.attachEvent('submit', validate_form);
  } else {
      form_.addEventListener('submit', validate_form);
  }
}

function validate_form(event) {

  const errLog = new ErrorLog();

  for(i1 = 0; i1 < form.size(); i1++){
    elem = form.objects[i1];
    console.log(i1);
    var retrievedValidElement = retrieveElement(elem);

    if(!retrievedValidElement) {
      event.preventDefault();
      errLog.add(getErrorMessage(elem.Tag));
    }
  }

  if(errLog.size()-1 > 0)  {
    alert(errLog.ToString());
  }

}

function getErrorMessage(tag){
  mess="";
  switch(tag) {
    case TAG_TITLE:
      mess = ERROR_TITLE_MISSING;
      break;
    case TAG_EMAIL:
      mess = ERROR_INVALID_MAIL;
      break;
    case TAG_MESSAGE:
      mess = ERROR_MESSAGE_LENGTH;
      break;
    case TAG_ORGANISATION:
      mess = ERROR_ORGANISATION_MISSING;
      break;
    case TAG_FIRSTNAME:
      mess = ERROR_FIRSTNAME_MISSING;
      break;
    case TAG_LASTNAME:
      mess = ERROR_LASTNAME_MISSING;
      break;
    case TAG_SELECTED_LECTURE:
      mess = elem.Alias + ERROR_SEMINARLECTURE_REQ;
      break;
    case TAG_SELECTED_SEMINAR:
      mess = elem.Alias + ERROR_SEMINARLECTURE_REQ;
      break;
    default:
      mess = ERROR_UNKNOWN + " of tag: " + elem.Tag;
      break;
  }
  return mess;
}

function retrieveElement(formElement){
  var value = document.getElementById(formElement.Tag).value;
    if (formElement.Tag === TAG_EMAIL) {
      
      if (isEmailValid(value) && value.length > 0) {
        formElement.Value=value;
        return true;
      }

    } else if(formElement.Tag === TAG_MESSAGE) {
      

      if(value.length <= MAX_MESSAGE_LENGTH){
        formElement.Value=value;
        return true;
      }
      

    } else if(formElement.Tag === TAG_SELECTED_LECTURE || formElement.Tag === TAG_SELECTED_SEMINAR) {

      var isSelected = document.getElementById(formElement.Tag).checked;
      var valueTitle = document.getElementById(TAG_TITLE).value;
      var valueMessage = document.getElementById(TAG_MESSAGE).value;

      if (isSelected) {
        
        if (valueTitle.length > 0) {
        //if (valueTitle.length > 0 && valueMessage.length > 0) {
          formElement.Value="selected";
          return true;
        } 

      } else {
          formElement.Value="not-selected";
          return true;
      }

    } else if(formElement.Tag === TAG_SELECTED_DISUSSION) {

      var isSelected = document.getElementById(formElement.Tag).checked;

      if (isSelected) {
          formElement.Value="selected";
          return true;
      } else {
          formElement.Value="not-selected";
          return true;
      }

    } else {

      if (formElement.Tag === TAG_TITLE) {

        var isDiscussionSelected = document.getElementById(TAG_SELECTED_DISUSSION).checked;
        if (isDiscussionSelected) {
          // Title can be blank when discussion is selected.
          formElement.Value=value;
          return true;
        } 

      }
      // Either lecture or seminar is selected here.
      if (value.length > 0) {
        formElement.Value=value;
        return true;
      }

    }

  event.preventDefault();
  return false;
}


function isEmailValid(email){
  var pattern =  /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
  return pattern.test(email);
}




// ------------ Objects ------------
function FormElement(tag, alias, value, required) {
  this.Tag=tag;
  this.Value=value;
  this.Alias=alias;

  if (typeof required === "boolean") {
    this.Required = required;
  } else {
    throw ERROR_BOOLEAN_REQUIRED
  }

  this.ToString = function () {
    console.log(`Tag: ${this.Tag}, Alias: ${this.Alias}, Value: ${this.Value}, Required: ${this.Required}`)
  }

}
function Form() {
  
  this.objects=[];


  this.init = function () {
    this.objects=[];
    this.add(new FormElement(TAG_FIRSTNAME, "Förnamn", "", true));
    this.add(new FormElement(TAG_LASTNAME, "Efternamn", "", true));
    this.add(new FormElement(TAG_ORGANISATION, "Organisation", "", true));
    this.add(new FormElement(TAG_EMAIL, "E-mail", "",true));
    this.add(new FormElement(TAG_TITLE, "Title", "",true));
    this.add(new FormElement(TAG_MESSAGE, "Description", "", true));
    this.add(new FormElement(TAG_SELECTED_LECTURE, "Lecture", "", false));
    this.add(new FormElement(TAG_SELECTED_SEMINAR, "Seminar", "", false));
    this.add(new FormElement(TAG_SELECTED_DISUSSION, "Discussion", "", false));
  }

  this.getObjectWithTag = function (tag) {
    for (i2 = 0; i2 < this.objects.length; i2++) {
      var obj = this.objects[i2];
      if(obj.Tag === tag)
        return obj;
    }
    return null;
  }

  this.size = function () {
    return this.objects.length;
  }

  this.add = function (obj) {
    if (typeof obj === "object") {
      this.objects.push(obj);
    } else {
      console.log(typeof obj);
      throw ERROR_FORM_OBJECT_TYPE;
    }
  }

}

function ErrorLog() {
  this.logs=[ERROR_PRELOG];
  
  this.ToString = function () {
    var trace = "";
    for (i3 = 0; i3 < this.logs.length; i3++) {
      if(i3 > 0)
        trace += "\t";
      trace += this.logs[i3] + "\n"; 
    }
    return trace;
  }

  this.print = function () {
    var trace = this.ToString();
    console.log(trace)
  }

  this.size = function () {
    return this.logs.length;
  }

  this.add = function (errMessage) {
    console.log(errMessage);
    if (typeof errMessage === "string") {
      this.logs.push(errMessage);
      this.print();
    } else {
      throw ERROR_REQUIRES_STRING;
    }
  }

}
// ------------------------------------

