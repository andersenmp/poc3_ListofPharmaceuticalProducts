IP="$(ip addr | grep 'state UP' -A2 | tail -n1 | awk '{print $2}' | cut -f1  -d'/')"
echo "Server will start at http://$IP:8000"
node bin/www