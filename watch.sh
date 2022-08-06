#!/bin/bash

daemon() {
    chsum1=""
    targetFolder="$1"
    CMD="$2"

    while [[ true ]]
    do
        chsum2=`find ${targetFolder} -type f -iname '*.idr' | xargs stat -f "%m" | md5`
        if [[ $chsum1 != $chsum2 ]] ; then
            # echo the date to indicate we are updating
            echo "startTime: $(date)"
            eval "$CMD"
            echo "endTime: $(date)"
            # tracks the check-sum
            chsum1=$chsum2
        fi
        # sleep for 2 secs
        sleep 2
    done
}

daemon "$1" "$2"
