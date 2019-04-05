// facebook api on alexa skill
// https://matchboxmobile.com/oauth-using-alexa
// ask commands:
// https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#update-skill-subcommand
// ask sdk
// https://ask-sdk-for-nodejs.readthedocs.io/en/latest/Setting-Up-The-ASK-SDK.html



// Node Functionality
//const Alexa = require('alexa-sdk');
const Alexa = require('ask-sdk-v1adapter');
var FacebookAPI = require('facebook-node');

// User Messages
var repeatWelcomeMessage = "you can say, read my feed";
var welcomeMessage = "Welcome to the facebook feed reader skill, " + repeatWelcomeMessage;
var stopSkillMessage = "Ok, see you next time!";
var helpText = "for instance " + repeatWelcomeMessage;
var tryLaterText = "Please try again later."
var postQuery = " Would you like to hear your feed again?";

// slots
var numberOfPosts = "";

// access token
var accessToken = "";
var sessionHandler;

const output = "";

// get Output Object
// var theOutput = {
//     theFbMessage: 'message not passed through',
//     get theOutput() {
//         return this.theFbMessage;
//     },
//     set theOutput (output) {
//         var msge = output; // convert to string?
//         this.theFbMessage = msge;
//     }
// }

// Create a new session handler
var sessionHandler = {
    'NewSession': function () {
        // NewSession is the context object instanciated within the handler.
        // Access token is instantiated. If available, it is then used for the facebookAPI.
        accessToken = this.event.session.user.accessToken;

        if (!accessToken) {
            var errMessage = "There was a problem getting the correct token for this skill"; 
            this.emit(':tell', errMessage, tryLaterText);
        }
        else {
            FacebookAPI.setAccessToken(accessToken); // set the access token for the FB API.
            this.emit(':ask', welcomeMessage, repeatWelcomeMessage); // then reply with the confirming message
        }
        
    },

    // Read fb feed handler
    'readFeedIntent': function () {
        // calling alexa-sdk.
        var alexa = this;
        var output = "";

        // Instantiating the slot
        var numberOfPosts = this.event.request.intent.slots.numberOfPosts.value;
        //var outputFeed = this.event.readFeedIntent.intent.slots.readPosts.value;
        
        // Double checking for access token.
        if (accessToken != "") {
            // gathering the response from the facebook API.
            FacebookAPI.api("/me/feed", function (response) {
                if (response && !response.error) {
                    // If the data is gathered put into a string to then output.
                    if (response.data) {
                        //var output = "";
                        for (var i = 0; i < response.data.length; i++) {
                            if (i < numberOfPosts) {
                                                // post number     // actual message  // appending fullstop.
                                output += "Post " + (i + 1) + ", " + response.data[i].message + ". ";
                                //var speechOutput = output;
                            }
                            // i want to repeat the output if the user wants to.
                            // i need to save the output as a session attribute.
                        }
                        //theOutput(output);
                        //this.response.speak(output + postQuery).listen(postQuery);
                        //alexa.emit(':responseReady');
                        //alexa.emit(':ask', output, output);
                        alexa.emit(':ask', (output + postQuery));
                    } 
                    else {
                        var errResponse = "Unable to parse the required data.";
                        alexa.emit(':tell', errResponse, tryLaterText);
                        // REPORT PROBLEM WITH PARSING DATA
                    }
                } else {
                    // Handle errors here.
                    console.log(response.error);
                }
                //this.attributes.lastSpeech = output;
                //this.attributes['readPosts'] = theOutput.theFbMessage; 
            });
        } else {
            this.emit(':tell', noAccessToken, tryLaterText);
        }
    },

    'AMAZON.RepeatIntent': function () {
        // Used to repeat the intent.
        this.response.speak(this.attributes['readPosts'] + "Do you want to hear your feed again?")
        .listen("Do you want to hear your feed again?");
        this.emit(':responseReady');
    },

    'AMAZON.CancelIntent': function () {
        // Triggered wheen user asks Alexa top cancel interaction
        this.emit(':tell', stopSkillMessage);
    },

    'AMAZON.StopIntent': function () {
        // Triggered wheen user asks Alexa top stop interaction
        this.emit(':tell', stopSkillMessage);
    },

    // Triggered wheen user asks Alexa for help
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpText, helpText);
    },

    // Triggered when no intent matches Alexa request
    'Unhandled': function () {
        this.emit(':ask', helpText, helpText);
    }
};

// Add handlers.
// handler contains the lambda function code ^above. (the required functionality)
// context is used to give details of the lambda function.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.dynamoDBTableName = 'storingSession';
    alexa.registerHandlers(sessionHandler);
    alexa.execute();
};
