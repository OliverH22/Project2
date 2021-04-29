"use strict";

// Handles the process of creating a new domo
var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! Name and age are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

// Handles the process of updating an existing domo
var handleUpdate = function handleUpdate(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), function () {
    getToken(generateDomoForm, {});
    loadDomosFromServer();
  });

  return false;
};

// Function for generating the JSX for the domo submission form
var DomoForm = function DomoForm(props) {
  return React.createElement(
    "form",
    { id: "domoForm",
      onSubmit: handleDomo,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
    React.createElement(
      "label",
      { htmlFor: "favorite" },
      "Likes: "
    ),
    React.createElement("input", { id: "fav", type: "text", name: "favorite", placeholder: "unknown" }),
    React.createElement(
      "label",
      { htmlFor: "leastFavorite" },
      "Dislikes: "
    ),
    React.createElement("input", { id: "leastFav", type: "text", name: "leastFavorite", placeholder: "unknown" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
  );
};

// Function for generating the JSX for the domo submission form
var UpdateForm = function UpdateForm(props) {
  var domo = props.domo;
  return React.createElement(
    "form",
    { id: "updateForm",
      onSubmit: handleUpdate,
      name: "updateForm",
      action: "/updateDomo",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: domo.name }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: domo.age }),
    React.createElement(
      "label",
      { htmlFor: "favorite" },
      "Likes: "
    ),
    React.createElement("input", { id: "fav", type: "text", name: "favorite", placeholder: domo.favorite }),
    React.createElement(
      "label",
      { htmlFor: "leastFavorite" },
      "Dislikes: "
    ),
    React.createElement("input", { id: "leastFav", type: "text", name: "leastFavorite", placeholder: domo.leastFavorite }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { type: "hidden", name: "_id", value: domo._id }),
    React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Save Domo" }),
    React.createElement("input", { className: "makeDomoSubmit", type: "button", id: "cancelEdit", value: "Cancel" })
  );
};

// Function for generating JSX to display the current user's domos
var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domolist" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Domos yet"
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    //console.dir(domo);
    var setForm = function setForm(e) {
      e.preventDefault();

      getToken(generateUpdateForm, { domo: domo });
      return false;
    };
    return React.createElement(
      "div",
      { key: domo._id, className: "domo" },
      React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
      React.createElement(
        "h3",
        { className: "domoName" },
        " Name: ",
        domo.name
      ),
      React.createElement(
        "h3",
        { className: "domoAge" },
        " Age: ",
        domo.age
      ),
      React.createElement(
        "h4",
        null,
        "Favorite thing: ",
        domo.favorite
      ),
      React.createElement(
        "h4",
        null,
        "Least Favorite thing: ",
        domo.leastFavorite
      ),
      React.createElement(
        "a",
        { className: "editButton", href: "", onClick: setForm },
        "Edit"
      )
    );
  });

  return React.createElement(
    "div",
    { id: "domoList" },
    domoNodes
  );
};

// Ajax request to get a list of Domos from the server
var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    //console.dir(data);
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

//Renders the DomoForm object
var generateDomoForm = function generateDomoForm(csrf) {
  //renders form
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));
};

//Renders the UpdateForm object
var generateUpdateForm = function generateUpdateForm(csrf, data) {
  //renders form
  ReactDOM.render(React.createElement(UpdateForm, { csrf: csrf, domo: data.domo }), document.querySelector("#makeDomo"));

  document.querySelector("#cancelEdit").addEventListener("click", function (e) {
    e.preventDefault();
    getToken(generateDomoForm, {});
    return false;
  });
};

// Sets up the maker page
var setup = function setup(csrf) {
  //console.log("Setup - maker called");
  generateDomoForm(csrf);

  //renders default domo list display
  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

  loadDomosFromServer();
};

$(document).ready(function () {
  getToken(setup, {});
});
'use strict';

// Get a Cross Site Request Forgery(csrf) token
var getToken = function getToken(callback, data) {
  //console.log("Token called.");
  sendAjax('GET', '/getToken', null, function (result) {
    callback(result.csrfToken, data);
  });
};

//Handles error by displaying it on the page.
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

//Redirects the client to the given page.
var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

//Handles AJAX calls to the server
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};