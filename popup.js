// For now use local but eventually we'll want some syncing
var storage = chrome.storage.local;
var terms = [];

function submitSpoiler(submitButton) {
  if (window.localStorage == null) {
    alert('Local storage is required for changing providers');
    return;
  }
  // Save it using the Chrome extension storage API.
  var newTerm = document.getElementById('spoiler-textfield').value;

  if (newTerm == "") {
    return;
  }

  terms.push(newTerm);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
    document.getElementById('spoiler-textfield').value = "";
  });
}

function removeTerm (deleteBtn)
{
  terms.splice (deleteBtn.id, 1);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
  });
}

function removeAllTerms() {
  terms = [];
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
  });
}

function getSpoilerTerms() {
  storage.get(['spoilerterms'], function(result) {
      // Nothing to change.
      if (!result.spoilerterms)
        return;

      terms = result.spoilerterms;
      generateTermsList (terms);
    });
}

function generateTermsList(terms) {
  // Refresh the list if it exists
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }

  // Find our container for our terms list
  var container = document.getElementById("spoiler-list-container");

  if (!terms || terms.length == 0) {
    // If it's empty, just add a placeholder tip for the user
    var emptyDiv = document.createElement ("div");
    emptyDiv.id = "empty-list";
    emptyDiv.className = "tip";
    emptyDiv.innerHTML = "<p>Add your first term to block in the form above.</p>";
    container.appendChild (emptyDiv);
  } else {
    var emptyNode = document.querySelector("#empty-list");
    if (emptyNode) {
      emptyNode.remove();
    }

    // Start popuplating the list
    var newList = document.createElement('ul');
    newList.id = "spoiler-list";
    container.appendChild (newList);

    // Popuplate our list of terms
    for(var i=0; i < terms.length; i++){
      newList.appendChild(generateListItem (i));
    }
  }
}

function generateListItem (index) {
    // Create our list item
    var listItem = document.createElement('li');

    // Create our delete button
    var deleteBtn = document.createElement('a');
    deleteBtn.title = "delete term";
    deleteBtn.className = "flat-button";
    deleteBtn.id = index;
    // Create our delte button icon
    var deleteIcon = document.createElement('i');
    deleteIcon.className = "red delete-btn";
    deleteIcon.innerHTML = "X";
    deleteBtn.appendChild(deleteIcon);
    // Add our removal event
    deleteBtn.addEventListener('click', function() {
      removeTerm(deleteBtn);
    });
    listItem.appendChild(deleteBtn);

    // Insert the term into the list
    var newTerm = document.createTextNode(terms[index]);
    listItem.appendChild(newTerm);

    return listItem;
}

function submitSpoilerEnter () {
  console.log (event.keyCode);
  if (event.keyCode == 13) {
    submitSpoiler ();
  }
}

function main() {
  if (window.localStorage == null) {
    alert("LocalStorage must be enabled for changing options.");
    document.getElementById('spoiler-textfield').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('delete-all-btn').disabled = true;
    return;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  getSpoilerTerms ();
  document.querySelector('#spoiler-textfield').focus ();
  document.querySelector('#submit-btn').addEventListener('click', submitSpoiler);
  document.querySelector('#spoiler-textfield').addEventListener("keydown", submitSpoilerEnter);
  document.querySelector('#delete-all-btn').addEventListener('click', removeAllTerms);
});
