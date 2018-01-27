 #!/bin/bash
 
 clear
 echo "Starting curl..."

 curl -s --user "api:key-eb30c3b68f928f85c256c7f8b70e8a67" \
     https://api.mailgun.net/v3/pocketphds.com/messages \
     -F from='rsproule23@gmail.com' \
     -F to='rsproule23@gmail.com' \
     -F subject='Hello' \
     -F text='This is a test'
 echo 
 echo "Done."
