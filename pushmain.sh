#!/bin/bash

git checkout main
git merge development
git push origin main
yarn build
git checkout development