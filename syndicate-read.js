#!/bin/env node
/*
   Copyright 2015 The Trustees of Princeton University

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
    var args = process.argv.slice(1);
    // last two arguments are the offset, len
    var offset = Number(args[args.length - 2])
    var len = Number(args[args.length - 1])
    args = args.slice(0,-2)
    var param = utils.parse_args(args);

    console.log("syndicate-read.js");
    console.log("param: " + JSON.stringify(param));
    try {
        var opts = syndicate.create_opts(param.user, param.volume, param.gateway, param.anonymous, param.debug_level);
        // init UG
        var ug = syndicate.init(opts);

        // try to open...
        var fh = syndicate.open(ug, param.path, "r");

        var len_left = len
        // seek & read
        try {
            syndicate.seek(ug, fh, offset);

            while(1) {
                var buf = syndicate.read(ug, fh, len_left);
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
        }

        // close
        syndicate.close(ug, fh);

        // shutdown UG
        syndicate.shutdown(ug);
    } catch (e) {
        console.error("Exception occured : " + e);
    }
})();
