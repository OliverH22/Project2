"use strict";

// Handles the process of creating a new link
var handleLink = function handleLink(e) {
  e.preventDefault();

  $("#linkMessage").animate({ width: 'hide' }, 350);

  if ($("#linkName").val() == '' || $("#linkAge").val() == '') {
    handleError("RAWR! Name and age are required");
    return false;
  }

  sendAjax('POST', $("#linkForm").attr("action"), $("#linkForm").serialize(), function () {
    loadLinksFromServer();
  });

  return false;
};

// Handles the process of updating an existing link
var handleUpdate = function handleUpdate(e) {
  e.preventDefault();

  $("#linkMessage").animate({ width: 'hide' }, 350);

  sendAjax('POST', $("#updateForm").attr("action"), $("#updateForm").serialize(), function () {
    getToken(generateLinkForm, {});
    loadLinksFromServer();
  });

  return false;
};

// Function for generating the JSX for the link submission form
var LinkForm = function LinkForm(props) {
  return React.createElement(
    "form",
    { id: "linkForm",
      onSubmit: handleLink,
      name: "linkForm",
      action: "/maker",
      method: "POST",
      className: "linkForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "linkName", type: "text", name: "name", placeholder: "Link Name" }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "linkAge", type: "text", name: "age", placeholder: "Link Age" }),
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
    React.createElement("input", { className: "makeLinkSubmit", type: "submit", value: "Make Link" })
  );
};

// Function for generating the JSX for the link submission form
var UpdateForm = function UpdateForm(props) {
  var link = props.link;
  return React.createElement(
    "form",
    { id: "updateForm",
      onSubmit: handleUpdate,
      name: "updateForm",
      action: "/updateLink",
      method: "POST",
      className: "linkForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "linkName", type: "text", name: "name", placeholder: link.name }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "linkAge", type: "text", name: "age", placeholder: link.age }),
    React.createElement(
      "label",
      { htmlFor: "favorite" },
      "Likes: "
    ),
    React.createElement("input", { id: "fav", type: "text", name: "favorite", placeholder: link.favorite }),
    React.createElement(
      "label",
      { htmlFor: "leastFavorite" },
      "Dislikes: "
    ),
    React.createElement("input", { id: "leastFav", type: "text", name: "leastFavorite", placeholder: link.leastFavorite }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { type: "hidden", name: "_id", value: link._id }),
    React.createElement("input", { className: "makeLinkSubmit", type: "submit", value: "Save Link" }),
    React.createElement("input", { className: "makeLinkSubmit", type: "button", id: "cancelEdit", value: "Cancel" })
  );
};

// Function for generating JSX to display the current user's links
var LinkList = function LinkList(props) {
  if (props.links.length === 0) {
    return React.createElement(
      "div",
      { className: "linklist" },
      React.createElement(
        "h3",
        { className: "emptyLink" },
        "No Links yet"
      )
    );
  }

  var linkNodes = props.links.map(function (link) {
    //console.dir(link);
    var setForm = function setForm(e) {
      e.preventDefault();

      getToken(generateUpdateForm, { link: link });
      return false;
    };
    return React.createElement(
      "div",
      { key: link._id, className: "link" },
      React.createElement("img", { src: "/assets/img/linkface.jpeg", alt: "link face", className: "linkFace" }),
      React.createElement(
        "h3",
        { className: "linkName" },
        " Name: ",
        link.name
      ),
      React.createElement(
        "h3",
        { className: "linkAge" },
        " Age: ",
        link.age
      ),
      React.createElement(
        "h4",
        null,
        "Favorite thing: ",
        link.favorite
      ),
      React.createElement(
        "h4",
        null,
        "Least Favorite thing: ",
        link.leastFavorite
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
    { id: "linkList" },
    linkNodes
  );
};

// Ajax request to get a list of Links from the server
var loadLinksFromServer = function loadLinksFromServer() {
  sendAjax('GET', '/getLinks', null, function (data) {
    //console.dir(data);
    ReactDOM.render(React.createElement(LinkList, { links: data.links }), document.querySelector("#links"));
  });
};

//Renders the LinkForm object
var generateLinkForm = function generateLinkForm(csrf) {
  //renders form
  ReactDOM.render(React.createElement(LinkForm, { csrf: csrf }), document.querySelector("#makeLink"));
};

//Renders the UpdateForm object
var generateUpdateForm = function generateUpdateForm(csrf, data) {
  //renders form
  ReactDOM.render(React.createElement(UpdateForm, { csrf: csrf, link: data.link }), document.querySelector("#makeLink"));

  document.querySelector("#cancelEdit").addEventListener("click", function (e) {
    e.preventDefault();
    getToken(generateLinkForm, {});
    return false;
  });
};

// Sets up the maker page
var setup = function setup(csrf) {
  //console.log("Setup - maker called");
  generateLinkForm(csrf);

  //renders default link list display
  ReactDOM.render(React.createElement(LinkList, { links: [] }), document.querySelector("#links"));

  loadLinksFromServer();
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
  $("#linkMessage").animate({ width: 'toggle' }, 350);
};

//Redirects the client to the given page.
var redirect = function redirect(response) {
  $("#linkMessage").animate({ width: 'hide' }, 350);
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