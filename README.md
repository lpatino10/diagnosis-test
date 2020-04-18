# Diagnosis tool

## Prerequisites
- Node >= 10.16.0
- Python 3

## Installation
Clone the repo and navigate to the root:

```
git clone https://github.com/lpatino10/diagnosis-test.git
cd diagnosis_tool
```

### With pipenv
If you have [pipenv](https://github.com/pypa/pipenv), you can run the following to set up a virutal environment and install the necessary packages:

```
pipenv shell
pipenv install
```

### Without pipenv
If you'd rather not do that, you can install the packages manually:

```
pip3 install django djangorestframework django-cors-headers pylint-django pylint autopep8
```

You also need to install the Node packages for the React app. Navigate to that subproject and install:

```
cd diagnosis-tool-frontend
npm install
cd ..
```

## Running
You'll need to have two separate terminal windows open to run the back-end and front-end together.

### Back-end

```
python manage.py runserver 8080
```

If `python` points at Python 2 on your system or you're not using pipenv, be sure to use `python3` in the above command instead.

### Front-end
Again navigate to the nested Node project and start that app:

```
cd diagnosis-tool-frontend
npm start
```

## Testing
Currently, there are just tests for the API endpoints. You can run these with the following command from the top-level of the project:

```
python manage.py test
```
