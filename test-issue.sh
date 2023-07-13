#!/bin/sh

npm run clean && npm run build:server && node test-issue.js