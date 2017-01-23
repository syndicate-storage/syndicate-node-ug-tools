#!/bin/env node
/*
   Copyright 2016 The Trustees of Princeton University

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

    console.log("syndicate-coord.js");
    console.log("param: " + JSON.stringify(param));
    try {
        var opts = syndicate.create_opts(param.user, param.volume, param.gateway, param.debug_level);
        // init UG
        var ug = syndicate.init(opts);
        // get gateway id
        var gid = syndicate.get_gateway_id(ug);

        var i;
        for(i=0;i<param.path.length;i++) {
            var path = param.path[i];
            // stat
            try {
                var stat = syndicate.stat_raw(ug, path);
                if(!stat.isFile()) {
                    console.error("Not a file: " + path);
                } else {
                    // if we're not the coordinator, become it
                    if(stat.coordinator !== gid) {
                       console.log("Become the coordinator of '" + path + "'");
                       var new_coord = syndicate.chcoord(ug, path);
                    }

                    // proceed to handle requests
                    console.log("Proceed to handle requests");
                    /*
                    rc = UG_main( ug );
                    if( rc != 0 ) {
                       fprintf(stderr, "UG_main: %s\n", strerror(-rc) );
                       rc = 1;
                    }
                    */
                }
            } catch (ex) {
                console.error("Exception occured : " + ex);
            }
        }

        // shutdown UG
        syndicate.shutdown(ug);
    } catch (e) {
        console.error("Exception occured : " + e);
    }
})();
