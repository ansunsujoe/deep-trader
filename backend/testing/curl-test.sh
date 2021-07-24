curl 'http://localhost:5001/users' \
  -H 'Connection: keep-alive' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  -H 'Sec-Fetch-Mode: cors' \
  --data-raw '{"data":{"name":"A1","username":"Aw2","password":"adwdw"}}' \
  --compressed