/*
 * odtimetracker-js-electron
 *
 * @license Mozilla Public License 2.0 https://www.mozilla.org/MPL/2.0/
 * @author Ondřej Doněk, <ondrejd@gmail.com>
 */

/**
 * @param {String} aInputId
 * @returns {ProjectAutocomplete}
 */
function ProjectAutocomplete(aInputId) {
  this.inputId = aInputId + '-project';
  this.input = document.getElementById(this.inputId);
  this.hiddenInputId = aInputId + '-projectId';
  this.hiddenInput = document.getElementById(this.hiddenInputId);
  this.targetId = this.inputId + '-projectAutocomplete';
  this.target = document.getElementById(this.targetId);
  this.projects = null;

  var self = this;

  /**
   * @param {Event} aEvent
   * @returns {void}
   */
  this.onResultClick = function(aEvent) {
    self.input.value = aEvent.target.innerHTML;
    self.hiddenInput = aEvent.target.getAttribute('data-projectId');
    self.target.classList.add('hide');//aEvent.target.parentElement.classList.add('hide');
  }; // end onResultClick(aEvent)

  /**
   * @returns {void}
   */
  this.clearResults = function() {
    while (this.target.firstChild) {
      this.target.removeChild(this.target.firstChild);
    }
  }; // end clearResults()

  /**
   * @param {Array} aResults
   * @returns {void}
   */
  this.renderResults = function(aResults) {
    if (aResults.length === 0 || !this.target) {
      return;
    }

    for (var i = 0; i < aResults.length; i++) {
      var li = document.createElement('li');
      li.setAttribute('data-projectId', aResults[i].ProjectId);
      li.innerHTML = aResults[i].Name;
      this.target.appendChild(li);
    }

    this.target.classList.remove('hide');
  }; // end renderResults(aResults)

  /**
   * @returns {void}
   */
  this.initResultsArea = function() {
    this.target = document.createElement('ul');
    this.target.setAttribute('id', this.targetId);
    this.target.classList.add('autocomplete-results');
    this.target.classList.add('hide');
    console.log(
      this.input,
      (this.input.offsetTop + 82) + 'px',
      this.input.offsetLeft + 'px',
      (this.input.offsetWidth - 2) + 'px'
    );
    this.target.style.position = 'absolute';
    this.target.addEventListener('click', this.onResultClick, false);
    // TODO There is no removal for the event listener!
    document.getElementById('body').appendChild(this.target);
  }; // end initResultsArea()

  /**
   * @returns {void}
   */
  this.updateResultsArea = function() {
    this.target.style.top = (this.input.offsetTop + 82) + 'px';
    this.target.style.left = this.input.offsetLeft + 'px';
    this.target.style.width = (this.input.offsetWidth - 2) + 'px';
  }; // end updateResultsArea()

  /**
   * @param {Event} aEvent
   * @returns {void}
   */
  this.onInputKeyup = function(aEvent) {
    console.log(aEvent);
    var val = this.input.value.toLowerCase();
    var results = new Array();

    if (this.projects === null) {
      console.log('there are no projects... thus no autocomplete...');
      return;
    }

    for (var i = 0; i < this.projects.length; i++) {
      var name = this.projects[i].Name.toLowerCase();
      if (name.indexOf(val) === 0) {
        results.push(self.projects[i]);
      }
    }

    this.clearResults();
    this.renderResults(results);
    this.updateResultsArea();
  }; // end onInputKeyup(aEvent)

  /**
   * @returns {void}
   */
  this.xhr = function() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState !== XMLHttpRequest.DONE) {
        return;
      }

      if (httpRequest.status !== 200) {
        return;
      }

      var data = JSON.parse(httpRequest.responseText);
      if ('projects' in data) {
        self.projects = data.projects;
      }
    };
    httpRequest.open('GET', getApiUrl('SelectProjects'));
    httpRequest.send();
  }; // end xhr()

  /**
   * @returns {void}
   */
  this.destroy = function() {
    this.clearResults();
    this.input.removeEventListener('keyup', this.onInputKeyup, false);
    this.input = null;
    this.target = null;
  };

  // Initialize
  this.xhr();

  if (this.target === null) {
    this.initResultsArea();
  }

  this.input.addEventListener(
    'keyup',
    function(e) { self.onInputKeyup(e); },
    false
  );
} // End of ProjectAutocomplete

// ===========================================================================
// Export public functions

exports.ProjectAutocomplete = ProjectAutocomplete;
