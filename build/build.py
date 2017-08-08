#!/usr/bin/env python

import sys
import os

import jsmin
from colorshell import out 

src = "../src"
outputFilename = "pretty-json.min.js"
files = [
    "util.js",
    "tpl.js",
    "node.js",
    "leaf.js",
]

out.info("merging libraries")
merged = '\n'.join([open(os.path.join(src, filename)).read() for filename in files])

out.info("compressing using jsmin")
minimized = jsmin.jsmin(merged)

out.info("writing to %s" % outputFilename)
open(outputFilename, "w").write(minimized)

out.info("done")
