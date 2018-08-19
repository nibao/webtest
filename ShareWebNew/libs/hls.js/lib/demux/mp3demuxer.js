'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * MP3 demuxer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _id = require('../demux/id3');

var _id2 = _interopRequireDefault(_id);

var _mpegaudio = require('./mpegaudio');

var _mpegaudio2 = _interopRequireDefault(_mpegaudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MP3Demuxer = function () {
  function MP3Demuxer(observer, remuxer, config) {
    _classCallCheck(this, MP3Demuxer);

    this.observer = observer;
    this.config = config;
    this.remuxer = remuxer;
  }

  _createClass(MP3Demuxer, [{
    key: 'resetInitSegment',
    value: function resetInitSegment(initSegment, audioCodec, videoCodec, duration) {
      this._audioTrack = { container: 'audio/mpeg', type: 'audio', id: -1, sequenceNumber: 0, isAAC: false, samples: [], len: 0, manifestCodec: audioCodec, duration: duration, inputTimeScale: 90000 };
    }
  }, {
    key: 'resetTimeStamp',
    value: function resetTimeStamp() {}
  }, {
    key: 'append',


    // feed incoming data to the front of the parsing pipeline
    value: function append(data, timeOffset, contiguous, accurateTimeOffset) {
      var id3 = new _id2.default(data);
      var pts = 90 * id3.timeStamp;
      var afterID3 = id3.length;
      var offset, length;

      // Look for MPEG header
      for (offset = afterID3, length = data.length; offset < length - 1; offset++) {
        if (data[offset] === 0xff && (data[offset + 1] & 0xe0) === 0xe0 && (data[offset + 1] & 0x06) !== 0x00) {
          break;
        }
      }

      _mpegaudio2.default.parse(this._audioTrack, data, id3.length, pts);

      this.remuxer.remux(this._audioTrack, { samples: [] }, { samples: [{ pts: pts, dts: pts, data: id3.payload }], inputTimeScale: 90000 }, { samples: [] }, timeOffset, contiguous, accurateTimeOffset);
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }], [{
    key: 'probe',
    value: function probe(data) {
      // check if data contains ID3 timestamp and MPEG sync word
      var id3 = new _id2.default(data),
          offset,
          length;
      if (id3.hasTimeStamp) {
        // Look for MPEG header | 1111 1111 | 111X XYZX | where X can be either 0 or 1 and Y or Z should be 1
        // Layer bits (position 14 and 15) in header should be always different from 0 (Layer I or Layer II or Layer III)
        // More info http://www.mp3-tech.org/programmer/frame_header.html
        for (offset = id3.length, length = Math.min(data.length - 1, offset + 100); offset < length; offset++) {
          if (data[offset] === 0xff && (data[offset + 1] & 0xe0) === 0xe0 && (data[offset + 1] & 0x06) !== 0x00) {
            //logger.log('MPEG sync word found !');
            return true;
          }
        }
      }
      return false;
    }
  }]);

  return MP3Demuxer;
}();

exports.default = MP3Demuxer;