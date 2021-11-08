"use strict";

require("./styles.css");

var _jquery = _interopRequireDefault(require("jquery"));

var _data = require("./data");

var _App = _interopRequireDefault(require("./objects/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app;
/**
 * Asking a question
 * "Enter a group or period of your life"
 * Freeform text
 * Options: Family, Primary School, Middle School, High School, University, Summer Camp, Church, Temple, Mosque
 * Press enter when done
 * On select and option, fill in input with that word
 * On enter: add new tag + open add new persons input
 *
 * "What people do you remember and associate with 'primary school' "
 * Press enter on each name + add them as persons to the board + confirmation that they were added
 * Button done with that category
 * On click, go back to asking category question
 */

(0, _jquery["default"])(function () {
  app = new _App["default"]("#svg", {
    zoomLevel: 4
  }, _data.INITIAL_PERSONS, _data.INITIAL_TAGS);
});
