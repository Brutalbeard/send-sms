const dotenv = require('dotenv')
const SDK = require('@ringcentral/sdk').SDK

// load environment file
dotenv.config()

// create RC sdk instance
const rcsdk = new SDK({
    server: process.env.RINGCENTRAL_PLATFORM_ADDRESS,
    clientId: process.env.RINGCENTRAL_CLIENT_ID,
    clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
    handleRateLimit: true
})

// the sdk will auto handle RC rate limit errors. this will log those in the console when they happen
rcsdk.platform().on(rcsdk.platform().events.rateLimitError, () => {
    console.log("Hit rate limit...")
})

// log into the rc account
rcsdk.login({
    username: process.env.RINGCENTRAL_USERNAME, // phone number in full format
    extension: process.env.RINGCENTRAL_EXTENSION, // leave blank if direct number is used
    password: process.env.RINGCENTRAL_PASSWORD
}).then(() => {
    console.log("Logged in successfully")
    main() // run main application
}).catch(e => {
    console.error("Issue logging in: ", e)
});

async function main() {

    // pull list of phone numbers belonging to the logged in extensions
    let fromNumbers = await rcsdk.get('/restapi/v1.0/account/~/extension/~/phone-number', {
        perPage: 1000
    }).then(res => {
        return res.json()
    }).then(res => {
        return res.records // return only the array of records
    }).catch(e => {
        console.error("Issue pulling user's phone number list: ", e)
    })

    let i = 1 // iterator
    for (let record of fromNumbers) {
        if (!record.features.includes('SmsSender')) { continue } // skip numbers that *can't* that this user can't send an sms with

        // post the message
        await rcsdk.post('/restapi/v1.0/account/~/extension/~/sms', {
            from: {
                phoneNumber: record.phoneNumber
            },
            to: [
                {
                    phoneNumber: process.env.TO_NUMBER
                }
            ],
            text: `Test message ${i}` // indicate message number
        }).then(() => {
            console.log(i) // log output for how many messages have been sent so far
            i += 1
        }).catch(e => {
            console.error("Issue sending an sms: ", e.message)
        })
    }

}