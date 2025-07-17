#!/bin/bash
LOG=~/main-server/export_cron.log
date >> $LOG
bash ~/main-server/tools/scripts/platform_export.sh >> $LOG 2>&1
echo "=== Fine task ===" >> $LOG
