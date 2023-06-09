
## Frontend

```sh
npm install -g yarn
yarn
yarn start
```

## Backend

```sh
# virtual env
python -m venv .venv
. .venv/bin/activate # on Linux
.venv/Scripts/activate # on Windows

# requirements
pip install -r ./server/requirements-lock.txt

# start server
python -m server.app start
```
