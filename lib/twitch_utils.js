const request = require("request");
const jwt = require("jsonwebtoken");

const {
  TWITCH_CHANNEL,
  TWITCH_USER_ID,
  TWITCH_EXT_CLIENT,
  TWITCH_EXT_SECRET
} = process.env;

module.exports.get_signed_jwt_token = function() {
  const exp = Math.floor(Date.now() / 1000) + (60 * 60);

  const jwtdata = {
    exp,
    user_id: "",
    role: "external",
    channel_id: TWITCH_CHANNEL,  
    pubsub_perms: {
      send:["*"],
      listen: ["*"]
    }
  };

  const secret = Buffer.from(TWITCH_EXT_SECRET, "base64");
  const token = jwt.sign(jwtdata, secret);

  return token;
}

module.exports.send_event_to_twitch = function(github_event, token) {
  const body = {
    content_type: "application/json",
    message: JSON.stringify(github_event),
    targets: ["broadcast"]
  };

  const options = {
    url: `https://api.twitch.tv/extensions/message/${TWITCH_CHANNEL}`,
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Client-Id": TWITCH_EXT_CLIENT,
      "Content-Type": "application/json"
    },
    body,
    json: true,
    gzip: true
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) reject(error); 
      resolve(response.statusCode);
    });
  });
}

