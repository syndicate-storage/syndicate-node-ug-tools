#!/usr/bin/env node
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

var syndicate = require('syndicate-storage');
var utils = require('./utils.js');

(function main() {
    var param = utils.parse_args(process.argv);

    console.log("syndicate-rename.js");
    console.log("param: " + JSON.stringify(param));
    try {
        var opts = syndicate.create_opts(param.user, param.volume, param.gateway, param.debug_level);
        // init UG
        var ug = syndicate.init(opts);

        var i;
        for(i=0;i<param.path.length;i+=2) {
            var src_path = param.path[i];
            var dest_path = param.path[i+1];
            // rename
            try {
                syndicate.rename(ug, src_path, dest_path);
                console.log("Renamed " + src_path + " to " + dest_path);
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
