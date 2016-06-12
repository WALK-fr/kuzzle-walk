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
_That is app is given for test purpose only, which mean that the code is not ready for a production usage
but only to demonstrate the power of angular2 coupled with a Kuzzle backend._

## Usage

### Connect to the application
Once the application is running, you can use one of the three built-in accounts to test it :

- ahanss / ahanss
- mparreno / mparreno
- pcavalet / pcavalet

### Use the chat to communicate and see connected people
On the top you have a chat pop-in that listen for incoming chat messages.
You also have the count of not read messages in the little circle linked.

On the left side of the screen you have the list of travel's members and a little greed circle that indicate if they are
currently connected and editing the travel with you.

You will also receive a notification if members join or leave the current session.

### Insert some markers

Just click on the map to put a temporary marker therefore, fill the form that opened on the right side of the screen
to add some information related to that marker.

You just have to click submit and others people will receive that marker instantly, it is also persisted in the backend.

### Write some notes

Alongside the button of chat at the top of the screen, you have the note button that allows you to write some notes related
to your travel.

Click on it and a new panel will pan, it's enough easy to understand how it work, so let's try it !

## Angular 2 Style Guide

The root code folder is located in the `app` folder, compiled files are server from `compiled` folder.
Please read more about angular2 style guide : [https://angular.io/styleguide](https://angular.io/styleguide)

