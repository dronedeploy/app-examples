<img src="dd_logo.png" alt="DroneDeploy logo" title="DroneDeploy App Platform" align="right" height="96" width="96"/>

# DroneDeploy App Examples

Example applications for DroneDeploy's App Platform.

See [developer.dronedeploy.com](https://developer.dronedeploy.com) to get up and running on DroneDeploy's App Platform.

## Setup

### Prerequisites

1. [Create](https://www.dronedeploy.com/signup.html) a DroneDeploy account
1. Become a DroneDeploy developer
1. Clone this repository

        $ git clone git@github.com:dronedeploy/app-examples.git

1. Install the CLI

        $ npm install -g serverless

1. Obtain a DroneDeploy developer API key

    Contact appmarket@dronedeploy.com and ask for a developer API key

1. Set your API key for the DroneDeploy CLI

        $ cd IFTTT/
        $ npm install
        $ serverless config dronedeploy-credentials --provider=dronedeploy --key=<YOUR API KEY>


### How to run a sample

1. Be in a directory of one of the sample folders, e.g. `IFTTT`:

        $ cd IFTTT/

1. Install the sample's dependencies

        $ npm install

1. Deploy the sample:

        $ serverless deploy


## Example Apps

### IFTTT

[See the example app](IFTTT)

[IFTTT](http://ifttt.com/) is a free platform that allows you to create custom rules for calling applications based on events. With this example, you will build an application that will send DroneDeploy Trigger Events to an [IFTTT webhook](https://ifttt.com/maker_webhooks).

## Contributing

Contributions are welcome! Please make a pull request on this repository.

## License
MIT

See [LICENSE](LICENSE)
