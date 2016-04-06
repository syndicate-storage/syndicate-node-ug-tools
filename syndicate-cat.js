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
    var param = utils.parse_args(args);

    console.log("syndicate-cat.js");
    console.log("param: " + JSON.stringify(param));
    try {
        var opts = syndicate.create_opts(param.user, param.volume, param.gateway, param.anonymous);
        // init UG
        var ug = syndicate.init(opts);

        // try to open...
        var fh = syndicate.open(ug, param.path, "r");

        // read
        try {
            while(1) {
                var buf = syndicate.read(ug, fh, 1024*64);
                if(buf.length > 0) {
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
