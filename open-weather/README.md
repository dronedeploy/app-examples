<img src="../dd_logo.png" alt="DroneDeploy logo" title="DroneDeploy App Platform" align="right" height="96" width="96"/>

# DroneDeploy App IFTTT example

<img src="readme_assets/ifttt_wordmark-blue.png" alt="IFTTT logo" title="DroneDeploy App Platform" height="80"/>

[IFTTT](http://ifttt.com/) is a free platform that allows you to create custom rules for calling applications based on events. With this example, you will build an application that will send DroneDeploy Trigger Events to an [IFTTT webhook](https://ifttt.com/maker_webhooks).

Be sure to complete the [pre-requisites](../README.md) and to read the DroneDeploy App Platform [documentation](https://developer.dronedeploy.,com).

## How to deploy and run the app

1. Complete the [pre-requisites](../README.md)

1. Install the sample's dependencies

        $ npm install

1. Drag the `app` directory into the Settings page App Zone.

1. Grab the app's ID

1. Copy the app ID into the `app` field in your serverless.yml file

1. Deploy your app

        $ serverless deploy

    Note that a new DroneDeploy Datastore will be configured. Additionally, you will note that a function named `ifttt-webhook` gets deployed as well.

1. Create an [IFTTT account](https://ifttt.com/join) if you do not have one already.

1. Go to the [IFTTT webhooks service](https://ifttt.com/maker_webhooks) and configure a new webhook

1. Go to the webhook's documentation page to get a trigger URL

    You should end up with URL that looks like `https://maker.ifttt.com/trigger/<TRIGGER NAME>/with/key/<YOUR IFTTT WEBHOOK KEY>`

1. Create a new IFTTT Applet that triggers on your IFTTT webhook and choose an action it should take.

    A good simple one is to send an [email](https://ifttt.com/email)

1. Navigate to your DroneDeploy settings page and open the IFTTT app

1. Paste your IFTTT webhook url and press save

1. Create a DroneDeploy export or process a new map. You should see your DroneDeploy Trigger Events get sent to your IFTTT webhook
