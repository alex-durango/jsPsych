# jspsych-image-audio-response

This plugin displays an image and records audio responses using a [MediaRecorder object](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder). The stimulus can be displayed until a response is given, or for a pre-determined amount of time. The plugin displays a 'recording indicator' to show the participant whether or not recording is in progress. The `allow_playback` parameter allows the recorded audio to be replayed to the participant and re-recorded if desired. Even in tasks where response playback should not be allowed, we recommend presenting an initial practice trial with `allow_playback: true` to allow the participant to check the recording quality before continuing with the experiment. 

## Browser compatibility

This plugin relies on the MediaStream Recording API, which is supported by current versions of Chrome, Firefox, and Edge browsers. It is *not* supported by Safari or Internet Exporer. Please see the [MediaStream Recording documentation](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API#Browser_compatibility) and the [Can I Use page](https://caniuse.com/?search=mediarecorder) for up-to-date information about browser compatibility.

## Processing and saving audio data

The plugin itself collects audio data as a stream, and breaks this into 1s chunks. These chunks are then passed to a function _you define_ called `postprocessing`. This `postprocessing` function allows you to send the audio data to a server. This also allows you to store an identifier in the jsPsych data that you can use to match up the recording with the trial data (see examples below). The format of the chunks in the blob array is .webm, which can be opened in some media programs (e.g. [VLC media player](https://videolan.org), [Audacity](https://www.audacityteam.org/)) and played or exported to another format.

If you're using NodeJS to host your experiment, see this guide on [saving to files in NodeJS](https://stackabuse.com/writing-to-files-in-node-js/). 

If you're using [JATOS](http://www.jatos.org/Whats-JATOS.html) to host your experiment, see the [`uploadResultFile` function in their documentation](http://www.jatos.org/jatos.js-Reference.html#jatosuploadresultfile), and the example on this page.

If the `postprocessing` parameter is not defined and the default function is used, the value of "audio_data" in the jsPsych data will contain the .webm-formatted audio recording encoded as a base 64 string. This is a text format that allows the audio data to be stored in the jsPsych data and converted from string to audio offline. However, note that even short audio recordings will produce very long base 64 strings (e.g. ~12,000 characters for a 2-second recording), and this may cause data storage/transfer problems, especially if the experiment contains many and/or long recordings. We therefore suggest using the `postprocessing` function to save the audio recordings as .webm files to a server.

## Mic permissions

Recording audio from a participant will require the participant to accept the browser's request to give the webpage access to their microphone. The specific way that this happens will depend on the browser and the participant's browser settings. When the experiment HTML file is opened directly in the browser, usually the browser will ask permission to use the mic at the start of _every_ recording. However, once the experiment HTML file is hosted on a server, typically the browser will only ask permission to use the mic _once_, before the first recording, and then remember the user's response on subsequent trials. 

## Ethics

Voice recordings should be considered to be personally-identifiable data and treated with the appropriate precautions to protect participants' privacy. This includes considerations about where the data will be stored, who might have access, and how quickly it should be transferred from a web server to a more secure location. 

Please note that, as with any freeform response field, there is a chance that you will encounter a response which mandates some kind of action on your behalf, such as evidence leading you to believe there is a real danger of harm to your participant or another person. You may, for example, pick up background sounds which give cause for concern. While this is probably unlikely to occur, you should have a plan in place for how to respond should a situation arise, and be clear on what your responsibilities are under your local laws, ethical oversight body, and personal conscience.

## Parameters

Parameters with a default value of *undefined* must be specified.
Other parameters can be left unspecified if the default value is acceptable.

Parameter | Type | Default Value | Description
----------|------|---------------|------------
stimulus | string | undefined | The path of the image file to be displayed.
buffer_length | numeric | 4000 | Length of the audio recording in ms.
postprocessing | function | See plugin file | The function to handle the audio buffer data. This parameter can be used to save the audio data to a server. The function takes the audio data as input, and must return an object with "str" and "url" keys. The "str" value is saved in the trial data as "audio_data". In the default function, the "str" value is the audio data converted to a base64 string, which is saved in the jsPsych data and can be later converted back into an audio file. When the audio data is saved separately to a server, the "str" value can be used to store an identifier that links the audio file to the jsPsych trial data, and it can be null if it is not needed. The "url" value is used as the audio source to replay the recording if `allow_playback` is true, and it can be null when `allow_playback` is false.
allow_playback | boolean | true | Whether or not to allow the participant to play back their audio recording and re-record if desired. If `allow_playback` is true, when the recording ends, an audio player will appear along with 'okay'/'rerecord' buttons. If the participant clicks 'okay', the trial will end, and if they click 'rerecord', recording starts again. There is no limit to the number of times that responses can be rerecorded. If `allow_playback` is false, the trial ends immediately after the recording ends.
recording_indicator_type | numeric | 1 | Selects which recording indicator HTML and positioning to use. 1 - Obvious recording indicator (default): filled/unfilled red circle under stimulus/prompt, all content centered. 2 - Unobtrusive recording indicator: stimulus/prompt centered, with "recording..." or "not recording..." text in bottom-right corner. 3 - Custom HTML. Stimulus/prompt placed directly above the recording on/off HTML, and all content centered. 4 - Custom HTML. Stimulus/prompt centered, recording on/off HTML can be positioned separately.'
recording_on_indicator | string | null | HTML to display while recording is in progress. See recording_indicator_type for default options. This parameter only needs to be specified if custom recording on/off HTML is used (recording_indicator_type is 3 or 4). If recording_indicator_type is 1 or 2, then any values passed to this parameter will be ignored.
recording_off_indicator | string | null | HTML to display while recording is not in progress. See recording_indicator_type for default options. This parameter only needs to be specified if custom recording on/off HTML is used (recording_indicator_type is 3 or 4). If recording_indicator_type is 1 or 2, then any values passed to this parameter will be ignored.
prompt | string | null | This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the participant is supposed to take.
stimulus_duration | numeric | null | How long to show the stimulus, in milliseconds. If `stimulus_duration` is null, then the stimulus will be shown until the trial ends.
stimulus_height | numeric | null | Image height in pixels. If null, the original image height will be used (unless stimulus_width is specified and maintain_aspect_ratio is true, in which case stimulus_height will be adjusted accordingly).
stimulus_width | numeric | null | Image width in pixels. If null, the original image width will be used (unless stimulus_height is specified and maintain_aspect_ratio is true, in which case stimulus_width will be adjusted accordingly).
maintain_aspect_ratio | boolean | true | Whether or not to maintain the aspect ratio of the image stimulus after setting width or height. If false, and if only one dimension is specified, then the unspecified dimension will be the original image . If true, and if only one dimension is specified, then the unspecified dimension will change so that the image aspect ratio is maintained. If both stimulus_height and stimulus_width are specified, then this parameter will be ignored.
button_label_okay | string | "Okay" | Label of the button that accepts the audio response and ends the trial, which is shown when `allow_playback` is true.
button_label_rerecord | string | "Rerecord" | Label of the button that re-records the audio response, which is shown when `allow_playback` is true.
margin_vertical | string | '0px' | Vertical margin of the "okay" and "rerecord" buttons.
margin_horizontal | string | '8px' | Horizontal margin of the "okay" and "rerecord" buttons.
wait_for_mic_approval | boolean | false | If true, the trial will not start until the participant approves the browser mic request. After the participant approves the mic request, the trial start time is logged and the page content is shown. If false, the image/prompt/recording indicator will be shown immediately, regardless of whether or not the browser requests permission to use the mic.
no_mic_message | string | "Audio recording not possible." | HTML-formatted string with message to show if no mic is found, or if the browser is not compatible.
no_mic_message_duration | numeric | 3000 | Duration to show the no mic message, in ms, if no mic is found or the browser is not compatible.


## Data Generated

In addition to the [default data collected by all plugins](overview#data-collected-by-plugins), this plugin collects the following data for each trial.

Name | Type | Value
-----|------|------
audio_data | string | The value of the "str" key in the object that is returned by the `postprocessing` function. If the default `postprocessing` function is used, this will contain the audio .webm data encoded as a base 64 string, which can be decoded back into an audio file offline. If a custom `postprocessing` function is used, this field can be used to store any other string, such as the name of the audio file that was saved to a server on this trial.
rt | numeric | The response time in milliseconds for the audio recording to end. The time is measured from when the stimulus first appears on the screen until the trial ends.
stimulus | string | The image file that was displayed.
has_mic | boolean | Whether or not the browser is compatible and successfully detected/accessed the mic. If false, there was a problem initiating the audio recording, and the `no_mic_message` was shown to the participant. This data allows the researcher to check the success of audio recording after an initial test trial, before continuing with additional audio-response trials.

## Examples

### Basic example with default saving option

```javascript
var trial = {
	type: "image-audio-response",
    stimulus: '../img/happy_face_1.jpg',
    prompt: '<p>How would you greet this face?</p>'
};
```

### Save the audio data as a separate file

```javascript
var id = "test";
var trial_count = 0;

function save_file_to_jatos(data) {
    return new Promise(function (resolve) {
        const blob = new Blob(data, { type: 'audio/webm; codecs=opus' });
        // Create URL from the audio blob, which is used to replay the audio file (when allow_playback is true)
        var url = URL.createObjectURL(blob);
        // Create the audio file name with the participant ID and trial number
        var filename = id + "_" + trial_count.toString() + ".webm";
        // Save the audio file to the server 
        // NOTE: if not using JATOS then replace this line with a command to save the file to your server
        jatos.uploadResultFile(blob, filename);
        // This function needs to return an object with the URL and data string.
        // - "url" allows the audio to be replayed if playback is true
        // - "str" is used to either save the audio data as base64 string or save the filename or other identifier to the jsPsych data.
        //   In this example function, the audio data has been saved separately to the server, 
        //   so "str" is used to save the name of the audio file that corresponds to this trial.
        var trial_data = { url: url, str: filename };
        resolve(trial_data);
    });
}

var trial = {
    type: 'image-audio-response',
    stimulus: '../img/happy_face_1.jpg',
    buffer_length: 3000,
    allow_playback: false,
    postprocessing: save_file_to_jatos,
    on_finish: function() {
        trial_count++;
    }
};
```