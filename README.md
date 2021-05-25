# DITTO

**D**/Vision [user] **I**nterfaces (for **T**ime and **T**echniques **O**ptimization)

![image info](./app/src/assets/logo.png)

## Project setup

To add **ditto** to another git repository, run the following from the desired repo:

```
git submodule add git@github.com:dvisionlab/ditto.git
git submodule init
```

## Project update

To update **ditto** in another repository, run the following from the desired repo:

```
git submodule update
```

## Import single module

To import a _ditto_ module in your repository:

```
import MODULE_NAME from "@/../ditto/MODULE_NAME";
```

## Available modules

| Module name        | Type                  | Doc                                       |
| ------------------ | --------------------- | ----------------------------------------- |
| **auth**           | Vue plugin            | [DOC](./app/library/auth/README.md)       |
| **dicom**          | Vue plugin            | [DOC](./app/library/dicom/README.md)      |
| **dicomDataTypes** | Components collection | [DOC](./app/library/data-types/README.md) |
| **dicomMetadata**  | Js dictionary         | [DOC](./app/library/dicom/README.md)      |
| **fileSystemApi**  | Js library            |                                           |
| **form**           | Components collection | [DOC](./app/library/form/README.md)       |
| **http**           | Vue plugin            | [DOC](./app/library/http/README.md)       |
| **mobile**         | Vue plugin            |                                           |
| **relativeHeight** | Vue directive         |                                           |
| **style**          | Js library            |                                           |
| **wireframes**     | Components collection | [DOC](./app/library/wireframes/README.md) |

## Run the examples

Run _ditto_:

```
cd app
yarn install
yarn serve
```

Go to _http://localhost:8080/_: you'll find the links to the available examples and documentation.
