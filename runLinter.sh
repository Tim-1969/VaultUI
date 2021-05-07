#!/bin/bash

npx eslint -c .eslintrc.json "$@" --fix src/ --ext .js,.ts