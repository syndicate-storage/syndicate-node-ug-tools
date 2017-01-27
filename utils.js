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

var minimist = require('minimist');

/**
 * Expose root class
 */
module.exports = {
    parse_args: function(args) {
        var options = {
            user: "",
            volume: "",
            gateway: "",
            debug_level: 0,
            path: []
        };

        // skip first two args
        // 1: node
        // 2: *.js script
        var argv = minimist(args.slice(2));

        // parse
        options.user = argv.u || "";
        options.volume = argv.v || "";
        options.gateway = argv.g || "";
        options.debug_level = argv.d || 0;
        options.path = argv._;
        return options;
    }
};
