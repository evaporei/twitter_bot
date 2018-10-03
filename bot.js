"use strict"

const Twit = require("twit")

const config = require("./config")

const T = new Twit(config)

const stream = T.stream("user")

let lastTweetPerson
let lastTweetBot

stream.on("tweet", tweetEvent)

console.log("The bot is starting")

function tweetEvent(eventMsg) {
	let reply = eventMsg.in_reply_to_screen_name
	let text = eventMsg.text
	let userFrom = eventMsg.user.screen_name

	if (reply === "DoMyMathBot") {
		if (text === lastTweetPerson) {
			postTweet("You already sent that one!")
			return
		}

		if (!text.match(/\d+/)) {
	    	postTweet("I am sorry @" + userFrom + ", but this tweet does not contain numbers :(")
		} 

    else {
			text = text.replace("@DoMyMathBot", "")

			try {
				let result = eval(text)
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
	if (tweetText === lastTweetBot) {	
		n++
		tweetText = "The result was the same as the last one(" + res + "). Times it happened: " + n
	} 

  else {

		tweetText = tweetText + res

	}
	
	let tweet = {
		status: tweetText
	}

	let gotData = (error, data, response) => {
		if (error) {
			console.log("Something went wrong! :(")
			console.log(error)
		} 

    else {
			console.log(data.text)
		}
	}

	T.post("statuses/update", tweet, gotData)
}