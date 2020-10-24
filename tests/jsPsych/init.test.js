const root = '../../';
const utils = require('../testing-utils.js');

describe('jsPsych.init', function(){
  test('adds body element if missing', function(){
    document.getElementsByTagName('body').forEach(function(el) {
        el.remove();
    });

    require(root + 'jspsych.js');
    require(root + 'plugins/jspsych-html-keyboard-response.js');

    var t = {
      type: 'html-keyboard-response',
      stimulus: 'foo'
    };

    jsPsych.init({timeline: [t]});

    expect(document.querySelectorAll('body').length).toMatch(1);

  });

  test('does not duplicate body element if it exists', function() {
    var body_el = document.createElement("body");
    document.documentElement.appendChild(body_el);

    require(root + 'jspsych.js');
    require(root + 'plugins/jspsych-html-keyboard-response.js');

    var t = {
      type: 'html-keyboard-response',
      stimulus: 'foo'
    };

    jsPsych.init({timeline: [t]});

    expect(document.querySelectorAll('body').length).toMatch(1);
    
  });
});