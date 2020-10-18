#!/usr/bin/env bash

if [ ! -d "/etc/owoblecto" ]; then
  sudo mkdir /etc/owoblecto
  sudo chown $(whoami) /etc/owoblecto

  dist/bin/owoblecto.js init
  dist/bin/owoblecto.js init database
fi

node tests/startup.js
node tests/startupTui.js
