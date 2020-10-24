const root = '../../';

describe('jsPsych.init', function(){
  test('only one body element added if initially missing', function(){
    document.querySelectorAll('body').forEach(function(el) {
        el.remove();
    });
    expect(document.querySelectorAll('body').length).toBe(0);

    require(root + 'jspsych.js');
    require(root + 'plugins/jspsych-html-keyboard-response.js');

    var t = {
      type: 'html-keyboard-response',
      stimulus: 'foo'
    };

    jsPsych.init({timeline: [t]});

    expect(document.querySelectorAll('body').length).toBe(1);

    document.querySelectorAll('body').forEach(function(el) {
        el.remove();
    });

  });

  test('only one body element if it already exists', function() {
    var body_el = document.createElement("body");
    document.documentElement.appendChild(body_el);
    expect(document.querySelectorAll('body').length).toBe(1);

    require(root + 'jspsych.js');
    require(root + 'plugins/jspsych-html-keyboard-response.js');

    var t = {
      type: 'html-keyboard-response',
      stimulus: 'foo'
    };

    jsPsych.init({timeline: [t]});

    expect(document.querySelectorAll('body').length).toBe(1);
    
  });
});