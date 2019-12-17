# send-sms

## About
This application will log into your RingCentral account (using password login flow), and send a test SMS from each of your extension's phone numbers. 

The list of phone numbers that are pulled from the RC account may or may not have the SendSMS feature enabled on them. If the phone number doesn't have that feature, it's skipped over. 

## Installation
Clone repo or download as zip and open. 

Change app root dir
```
$ cd /path/to/app
```
Install dependencies (this app is written using JavaScript and will requires [Node](nodejs.org)
```
$ npm install
```
Make a copy of ```env_example``` and rename it to ```.env```. Then fill in the appropriate fields. 
```
RINGCENTRAL_USERNAME=
RINGCENTRAL_EXTENSION=
RINGCENTRAL_PASSWORD=

RINGCENTRAL_CLIENT_ID=
RINGCENTRAL_CLIENT_SECRET=
RINGCENTRAL_PLATFORM_ADDRESS=https://platform.ringcentral.com

TO_NUMBER= # This is the phone number you want to send the SMS to
```

## Run the app
Once everything is filled in...
```
$ node .
```
Each message will go out from the phone number and will say "Test Message {iterator}".