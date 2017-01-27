#!/usr/bin/env node
/*
   Copyright 2016 The Trustees of University of Arizona

   Licensed under the Apache License, Version 2.0 (the "License" );
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var syndicate = require('syndicate-drive');
var utils = require('./utils.js');

(function main() {
    var param = utils.parse_args(process.argv);

    console.log("syndicate-read.js");
    console.log("param: " + JSON.stringify(param));
    try {
        var opts = syndicate.create_opts(param.user, param.volume, param.gateway, param.debug_level);
        // init UG
        var ug = syndicate.init(opts);

        // last two arguments are the offset, len
        var i;
        for(i=0;i<param.path.length;i+=3) {
            var path = param.path[i];
            var offset = Number(param.path[i+1]);
            var len = Number(param.path[i+2]);

            // try to open...
            var fh = syndicate.open(ug, path, "r");

            var len_left = len
            // seek & read
            try {
                syndicate.seek(ug, fh, offset);

                while(1) {
                    var buf = syndicate.read(ug, fh, Math.min(len_left, 1024*64));
                    if(buf.length > 0) {
                        len_left -= buf.length;
                        process.stdout.write(buf);
                    } else {
                        // EOF
                        break;
                    }
                }
            } catch (ex) {
                console.error("Exception occured : " + ex);
                break;
            }

            // close
            syndicate.close(ug, fh);
        }

        // shutdown UG
        syndicate.shutdown(ug);
    } catch (e) {
        console.error("Exception occured : " + e);
    }
})();
