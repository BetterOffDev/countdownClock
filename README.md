# Countdown Clock

## Author:

Will Spencer ( [@BetterOffDev](http://twitter.com/BetterOffDev) )

## Summary
This was a project I was hired to do for a client, but thought it might be useful to someone else. The client needed a clock that updated every minute that told site visitors how much time they had left to order their products to assure same day shipping. The client was not able to utilize external libraries like jQuery or moment.js, so I had to write the Javascript from scratch. 

The script will display the amount of time left (based on EST) before the business closes at 4:00pm. It also takes into account if the business is closed for a holiday or weekend. The business also closes 2 hours early the day before a holiday, so there's a lot going on here. 

The client is responsible for adding to the holidays array, which is just a list of dates the business is closed. They also have to set a boolean variable for if it's currently daylight savings time since that gets tricky. 

If you aren't seeing the clock in the display, that means the business is closed! If you see the clock, it will update every minute to reflect the amount of time left.

## Demo
[See it in action!](http://willspencerdesign.com/countdownClock)

It's also on CodePen....woo hoo!
[CodePen](http://codepen.io/BetterOffDev/pen/JdrPYe)