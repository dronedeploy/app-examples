<img src="dd_logo.png" alt="DroneDeploy logo" title="DroneDeploy App Platform" align="right" height="96" width="96"/>

# DroneDeploy App Examples

## Setup

### Prerequisites

1. Create an account on DroneDeploy
1. Become a DroneDeploy developer
1. Clone this repository

        $ git clone git@github.com:dronedeploy/app-examples.git

1. Install the CLI

        $ cd app-examples
        $ npm install -g serverless
        $ npm install

1. Obtain a DroneDeploy developer API key

    Contact developer@dronedeploy.com and ask for a developer API key

1. Set your API key for the DroneDeploy CLI

        $ serverless config credentials --provider=dronedeploy --key=<YOUR API KEY>


### How to run a sample

1. Change directory to one of the sample folders, e.g. `IFTTT`:

        $ cd IFTTT/

1. Install the sample's dependencies

        $ npm install

1. Deploy the sample:

        $ serverless deploy


## Example Apps

### IFTTT

[See the example app](IFTTT)

[IFTTT](http://ifttt.com/) is a free platform that allows you to create custom rules for calling applications based on events. This sample DroneDeploy app allows you to send DroneDeploy Trigger Events to an [IFTTT webhook](https://ifttt.com/maker_webhooks).

## Contributing

Contributions are welcome!

## License
MIT

See [LICENSE](LICENSE)