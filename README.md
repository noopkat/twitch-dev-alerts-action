# Twitch Developer Alerts GitHub Action

This is a GitHub Action designed to filter payload data from GitHub events from a repository and send a smaller payload on to a Twitch extension. It currently supports Issue, Pull Request, and Check Suite events. The code running within the container is written in JavaScript, for ease of JSON parsing and JWT signing.

The [source code for the Twitch extension is also on Github](https://github.com/noopkat/twitch-dev-alerts-extension).
