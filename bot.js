"use strict"

console.log("The bot is starting")

//Twit package that handles the Twitter API
let Twit = require("twit")

//config keys
let config = require("./config")
let T = new Twit(config)
let stream = T.stream("user")

stream.on("tweet", tweetEvent)

let lastTweetPerson = ""
let lastTweetBot = ""

function tweetEvent(eventMsg) {
	let reply = eventMsg.in_reply_to_screen_name
	let text = eventMsg.text
	let userFrom = eventMsg.user.screen_name

	if (reply === "DoMyMathBot") {
		//this is actually blocked by Twitter, but double checking is good
		if (text === lastTweetPerson) {
			postTweet("You already sent that one!")
			return
		}

		if (!text.match(/\d+/)) {
      postTweet("I am sorry @" + userFrom + ", but this tweet does not contain numbers :(")
		} else {
			text = text.replace("@DoMyMathBot", "")

			try {
				let result = eval(text)//can do errors, so it will go to the catch part
				postTweet("Hi, @" + userFrom + "! Here is your result ", result)
			} catch (error) {
				postTweet("Hi, @" + userFrom + "! Can you check the expression? Look at my profile to see how to get a result")
			}
    }

		lastTweetPerson = text
	}
}

let n = 0

function postTweet(tweetText, res) {
	//this checks if the bot will not tweet
	//the same thing over and over again
	if (tweetText === lastTweetBot) {
		n++
		tweetText = "The result was the same as the last one(" + res + "). Times it happened: " + n
	} else {
		tweetText = tweetText + res
	}

	let tweet = {
		status: tweetText
	}

	let gotData = (error, data, response) => {
		if (error) {
			console.log("Something went wrong! :(")
			console.log(error)
		} else {
			console.log(data.text)
		}
	}
	T.post("statuses/update", tweet, gotData)
}