# Crust - To The Point

To run the project you must run both the frontend and the backend.

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
pip install -r ./server/requirements.txt

# start server
python -m server.app start --production
```

Now open [http://localhost:5000/dashboard/home](http://localhost:5000/dashboard/home).
