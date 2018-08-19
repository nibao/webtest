'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('../events');

var _events2 = _interopRequireDefault(_events);

var _eventHandler = require('../event-handler');

var _eventHandler2 = _interopRequireDefault(_eventHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * id3 metadata track controller
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var ID3TrackController = function (_EventHandler) {
  _inherits(ID3TrackController, _EventHandler);

  function ID3TrackController(hls) {
    _classCallCheck(this, ID3TrackController);

    var _this = _possibleConstructorReturn(this, (ID3TrackController.__proto__ || Object.getPrototypeOf(ID3TrackController)).call(this, hls, _events2.default.MEDIA_ATTACHED, _events2.default.MEDIA_DETACHING, _events2.default.FRAG_PARSING_METADATA));

    _this.id3Track = undefined;
    _this.media = undefined;
    return _this;
  }

  _createClass(ID3TrackController, [{
    key: 'destroy',
    value: function destroy() {
      _eventHandler2.default.prototype.destroy.call(this);
    }

    // Add ID3 metatadata text track.

  }, {
    key: 'onMediaAttached',
    value: function onMediaAttached(data) {
      this.media = data.media;
      if (!this.media) {
        return;
      }

      this.id3Track = this.media.addTextTrack('metadata', 'id3');
      this.id3Track.mode = 'hidden';
    }
  }, {
    key: 'onMediaDetaching',
    value: function onMediaDetaching() {
      this.media = undefined;
    }
  }, {
    key: 'onFragParsingMetadata',
    value: function onFragParsingMetadata(data) {
      var fragment = data.frag;
      var samples = data.samples;
      var startTime = fragment.start;
      var endTime = fragment.start + fragment.duration;
      // Give a slight bump to the endTime if it's equal to startTime to avoid a SyntaxError in IE
      if (startTime === endTime) {
        endTime += 0.0001;
      }

      // Attempt to recreate Safari functionality by creating
      // WebKitDataCue objects when available and store the decoded
      // ID3 data in the value property of the cue
      var Cue = window.WebKitDataCue || window.VTTCue || window.TextTrackCue;

      for (var i = 0; i < samples.length; i++) {
        var id3Frame = this.parseID3Frame(samples[i].data);
        var frame = this.decodeID3Frame(id3Frame);
        if (frame) {
          var cue = new Cue(startTime, endTime, '');
          cue.value = frame;
          this.id3Track.addCue(cue);
        }
      }
    }
  }, {
    key: 'parseID3Frame',
    value: function parseID3Frame(data) {
      if (data.length < 21) {
        return undefined;
      }

      /* http://id3.org/id3v2.3.0
      [0]     = 'I'
      [1]     = 'D'
      [2]     = '3'
      [3,4]   = {Version}
      [5]     = {Flags}
      [6-9]   = {ID3 Size}
      [10-13] = {Frame ID}
      [14-17] = {Frame Size}
      [18,19] = {Frame Flags}
      */
      if (data[0] === 73 && // I
      data[1] === 68 && // D
      data[2] === 51) {
        // 3

        var type = String.fromCharCode(data[10], data[11], data[12], data[13]);
        data = data.subarray(20);
        return { type: type, data: data };
      }
    }
  }, {
    key: 'decodeID3Frame',
    value: function decodeID3Frame(frame) {
      if (frame.type === 'TXXX') {
        return this.decodeTxxxFrame(frame);
      } else if (frame.type === 'PRIV') {
        return this.decodePrivFrame(frame);
      } else if (frame.type[0] === 'T') {
        return this.decodeTextFrame(frame);
      } else {
        return undefined;
      }
    }
  }, {
    key: 'decodeTxxxFrame',
    value: function decodeTxxxFrame(frame) {
      /*
      Format:
      [0]   = {Text Encoding}
      [1-?] = {Description}\0{Value}
      */

      if (frame.size < 2) {
        return undefined;
      }

      if (frame.data[0] !== 3) {
        //only support UTF-8
        return undefined;
      }

      var index = 1;
      var description = this.utf8ArrayToStr(frame.data.subarray(index));

      index += description.length + 1;
      var value = this.utf8ArrayToStr(frame.data.subarray(index));

      return { key: 'TXXX', description: description, data: value };
    }
  }, {
    key: 'decodeTextFrame',
    value: function decodeTextFrame(frame) {
      /*
      Format:
      [0]   = {Text Encoding}
      [1-?] = {Value}
      */

      if (frame.size < 2) {
        return undefined;
      }

      if (frame.data[0] !== 3) {
        //only support UTF-8
        return undefined;
      }

      var data = frame.data.subarray(1);
      return { key: frame.type, data: this.utf8ArrayToStr(data) };
    }
  }, {
    key: 'decodePrivFrame',
    value: function decodePrivFrame(frame) {
      /*
      Format: <text string>\0<binary data>
      */

      if (frame.size < 2) {
        return undefined;
      }

      var owner = this.utf8ArrayToStr(frame.data);
      var privateData = frame.data.subarray(owner.length + 1);

      return { key: 'PRIV', info: owner, data: privateData.buffer };
    }

    // http://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript/22373197
    // http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
    /* utf.js - UTF-8 <=> UTF-16 convertion
     *
     * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */

  }, {
    key: 'utf8ArrayToStr',
    value: function utf8ArrayToStr(array) {

      var char2 = void 0;
      var char3 = void 0;
      var out = '';
      var i = 0;
      var length = array.length;

      while (i < length) {
        var c = array[i++];
        switch (c >> 4) {
          case 0:
            return out;
          case 1:case 2:case 3:case 4:case 5:case 6:case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
          case 12:case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
            break;
        }
      }

      return out;
    }
  }]);

  return ID3TrackController;
}(_eventHandler2.default);

exports.default = ID3TrackController;