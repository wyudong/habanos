curl example

```
curl 'http://localhost:3000/api/stampInfo?checkInfo=000059000755,123.122.121.120,United%20States' \
  -H 'Origin: http://localhost:8026' \
  -H 'Referer: http://localhost:8026/'
```

PM2 example

```
pm2 start main.js --name <app_name> --time --no-autorestart -- <serial_index> <end_index>
```
