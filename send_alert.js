require("dotenv").config();

const event_processor = require("./lib/event_processor");
const twitch_utils = require("./lib/twitch_utils");

const github_event = event_processor.create_event_payload();
if (!github_event) return;

const jwt_token = twitch_utils.get_signed_jwt_token();

twitch_utils.send_event_to_twitch(github_event, jwt_token)
  .then((statusCode) => console.log("sent event to twitch extension. status code:", statusCode))
  .catch((error) => console.error("could not send event:", error));
