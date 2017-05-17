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

var syndicate = require('syndicate-storage');
var utils = require('./utils.js');
var fs = require('fs');

var BUF_SIZE = 4096;

(function main() {
    var param = utils.parse_args(process.argv);

    console.log("syndicate-write.js");
    console.log("param: " + JSON.stringify(param));
    try {
        var opts = syndicate.create_opts(param.user, param.volume, param.gateway, param.debug_level);
        // init UG
        var ug = syndicate.init(opts);

        var i;
        for(i=0;i<param.path.length;i+=3) {
            var local_path = param.path[i];
            var syndicate_path = param.path[i+1];
            var offset = Number(param.path[i+2]);
            // try to open a local file
            var lfh = fs.openSync(local_path, "r");

            // try to open...
            var fh = syndicate.open(ug, syndicate_path, "a");
            syndicate.seek(ug, fh, offset);

            // var buffer
            var buffer = new Buffer(BUF_SIZE);
            // write
            try {
                while(1) {
                    var bytesRead = fs.readSync(lfh, buffer, 0, BUF_SIZE, null);
                    if(bytesRead > 0) {
                        syndicate.write(ug, fh, buffer.slice(0, bytesRead));
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

            fs.closeSync(lfh);
        }

        // shutdown UG
        syndicate.shutdown(ug);
    } catch (e) {
        console.error("Exception occured : " + e);
    }
})();
