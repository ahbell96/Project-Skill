
/*
Mocha tests for the Alexa skill "Hello World" example (https://github.com/alexa/skill-sample-nodejs-hello-world).
Using the Alexa Skill Test Framework (https://github.com/BrianMacIntosh/alexa-skill-test-framework).

Run with 'mocha examples/skill-sample-nodejs-hello-world/helloworld-tests.js'.
*/

// include the testing framework
const alexaTest = require('alexa-skill-test-framework');
//const alexaTest = require('../../index');

// initialize the testing framework
alexaTest.initialize(
	require('../lambda/us-east-1_facebook-skill-test/index.js'),
	"amzn1.ask.skill.00000000-0000-0000-0000-000000000000",
	"amzn1.ask.account.VOID");

describe("facebook test", function () {

	// tests the behavior of the skill's HelloWorldIntent
	describe("readFeedIntent", function () {
		alexaTest.test([
			{
				request: alexaTest.getIntentRequest("readFeedIntent"),
				says: "Hello World!", repromptsNothing: true, shouldEndSession: true,
			}
		]);
	});

	// tests the behavior of the skill's HelloWorldIntent with like operator
	describe("HelloWorldIntent like", function () {
		alexaTest.test([
			{
				request: alexaTest.getIntentRequest("HelloWorldIntent"),
				saysLike: "World", repromptsNothing: true, shouldEndSession: true
			}
		]);
	});
});
