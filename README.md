# LITERATURE-CARTS-QUASAR-FRONT Project

## Platform

### Create conda env

```
conda create -n literature-carts-env
```

### Activate conda env

```
conda activate literature-carts-env
```

### Configure conda env

```
# configure conda for the literarute-carts-env environment
# set strict channel order
conda config --env --set channel_priority strict
# add conda-forge
conda config --env --add channels conda-forge
# remove default
conda config --env --remove channels 'defaults'
```

### Install nodejs

```
conda install -c conda-forge nodejs=18
```

### Install yarn + quasar + vue in conda env

```
conda install -c conda-forge yarn=1.22.22
npm i -g @vue/cli
npm i -g @quasar/cli
```


## Currents versions

Quasar:

```
quasar --version
@quasar/app-vite 1.4.3 (@quasar/cli 2.5.0)
```

Vue:

```
vue --version
@vue/cli 5.0.8
```

Npm:

```
npm --version
10.8.2
```

Node:

```
node --version
v18.20.5
```

Yarn:

```
yarn --version
1.22.22
```

## App

### Install the dependencies

```
yarn
```

### Generate .env

```
ln -s .env.local .env
```

### Generate Git env

```
rm -fr .git
git init
git remote add origin url_repository
git push -u origin master
```

### Run dev web app

```
make run-dev-web-app
```

### Build web app for production

```
make build-prod-web-app
```

### Run web app for production

```
make run-prod-web-app
```

## Adding boot file

Execute

```
quasar new boot <name> [--format ts]
```

See [Boot files](https://quasar.dev/quasar-cli-webpack/boot-files/) to add boot files

## Adding pinia store

Execute

```
quasar new store <store_name> [--format ts]
```

See [Pinia store](https://quasar.dev/quasar-cli-vite/state-management-with-pinia/)

## Adding persisted state to pinia store

See [Refresh proof](https://www.vuemastery.com/blog/refresh-proof-your-pinia-stores/)

# Others interesting things

## Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Install apollo to quasar

See (https://github.com/quasarframework/app-extension-apollo/tree/v2)
Execute

```
quasar ext add @quasar/apollo@next
```