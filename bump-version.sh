#!/bin/sh

if [ $# -ne 1 ]; then
	echo "Usage: ./bump-version.sh <version>"
	exit 1
fi

for FILE in README.md couchapp.json; do
	if ! sed 's/#VERSION#/'$1'/g' $FILE > .$FILE; then
		echo "Could not replace VERSION variable in $FILE." >&2
		exit 2
	fi
	
	# mv -f .$FILE $FILE
	# git add $FILE
done

# git commit -m "Bumped version number to $1."