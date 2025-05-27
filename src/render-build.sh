#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Chromium for Puppeteer
npx puppeteer browsers install chrome

# Install npm dependencies
npm install
