#!/bin/sh

pushd .
mkdir chromium
cd chromium
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH=PATH:/path/to/depot_tools
fetch --nohooks --no-history chromium
./build/install-build-deps.sh
gclient runhooks
cd src
gn gen out/Default
ninja -C out/Default osmesa
popd
