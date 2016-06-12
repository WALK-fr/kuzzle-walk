# Kuzzle Walk Application

This application has been built in order to participate the Kuzzle challenge powered by Kaliop.

# Authors

**WALK-FR Team** : [Github](https://github.com/WALK-fr)

- Andréas Hanss
  - [Github](https://github.com/ScreamZ)
  - [LinkedIn](https://www.linkedin.com/in/andréas-hanss-07071b71)
- Michel Parreno
  - [Github](https://github.com/michel-p)
  - [LinkedIn](https://www.linkedin.com/in/michelparreno)
- Pierre Cavalet
  - [Github](https://github.com/PierreCavalet)
  - [LinkedIn](https://www.linkedin.com/in/pierre-cavalet-a862a3108)

## Prerequisites & initialization

- NodeJS > 4.0 (5 preferred)
- NPM
- Typings (npm install typings --global)

Go to the root folder of the current repository and run `npm install` then run `npm start`.

Then just visit [http://localhost:3000](http://localhost:3000)

## Disclaimer
_This app was created for a testing purpose, which means that the code is not production ready. The goal is to illustrate the power of Angular 2 and the Kuzzle backend used together._

## Usage

### Connect to the application
Once the application is running, you can use one of the three built-in accounts to test it :

- ahanss / ahanss
- mparreno / mparreno
- pcavalet / pcavalet

### Use the chat to communicate and see connected people
In the navigation bar, you can find a button that toggles a real time chat. There is a tracker on the messages you have not read yet.

On the left, you can find the of the travel's members and a little green circle that indicate if they are currently connected or not.

You will also receive a notification when a member starts or stops working on the travel.

### Insert some markers

You can click on the map or use the search bar on the bottom left corner to add a temporary marker.

In order to persist the marker, you have to fill the form on the right side of the screen and add some informations related to the marker.

Once the form is submitted, the marker is persisted and the other members will receive the marker.

### Write some notes

Alongside the chat’s button in the navbar, you can find the note’s button that allows you to write some notes related
to your travel.

Click on it and a new panel will appear, and the usage is quite straightforward, so let's try it !

## Angular 2 Style Guide

The root code folder is located in the `app` folder, compiled files are served from `compiled` folder.
Please read more about angular2 style guide : [https://angular.io/styleguide](https://angular.io/styleguide)