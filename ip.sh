#!bin/bash
ip a | grep 'inet 10' > ret
ip=`cat ret | cut -c 10- | cut -d '/' -f1`
env INTRANET_IP=$ip > /dev/null
echo "$INTRANET_IP"
rm ret
