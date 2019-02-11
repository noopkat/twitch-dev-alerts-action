require("dotenv").config();
const fs = require("fs");

const {
  GITHUB_EVENT_PATH,
  GITHUB_EVENT_NAME
} = process.env;

const {
  github_event_names,
  github_action_names
} = require("./github_utils.js");

module.exports.create_event_payload = function() {
  let github_event; 

  const github_payload = fs.readFileSync(GITHUB_EVENT_PATH, {"encoding": "utf-8"});
  const payload_json = JSON.parse(github_payload);

  if (GITHUB_EVENT_NAME === github_event_names.check_suite) {
    if (payload_json.action !== github_action_names.completed) return;

    github_event = {
      event_name: GITHUB_EVENT_NAME,
      conclusion: payload_json.check_suite.conclusion,
      head_branch: payload_json.check_suite.head_branch,
      head_sha: payload_json.check_suite.head_sha,
      sender: payload_json.sender.login,
      repository: payload_json.repository.name,
      html_url: payload_json.repository.html_url
    }
    
    if (payload_json.check_suite.pull_requests.length) {
      github_event.html_url  = payload_json.check_suite.pull_requests[0].html_url;
      github_event.number = payload_json.check_suite.pull_requests[0].number;
    };
  }

  if (GITHUB_EVENT_NAME === github_event_names.pull_request) {
    if (payload_json.action !== github_action_names.opened && payload_json.action !== github_action_names.closed) return;

    github_event = {
      event_name: GITHUB_EVENT_NAME,
      action: payload_json.action,
      merged: payload_json.pull_request.merged,
      number: payload_json.number,
      html_url: payload_json.pull_request.html_url,
      sender: payload_json.pull_request.user.login,
      repository: payload_json.repository.name
    }
  }

  if (GITHUB_EVENT_NAME === github_event_names.issue) {
    if (payload_json.action !== github_action_names.opened && payload_json.action !== github_action_names.closed) return;

    github_event = {
      event_name: GITHUB_EVENT_NAME,
      action: payload_json.action,
      number: payload_json.issue.number,
      html_url: payload_json.repository.html_url,
      sender: payload_json.issue.user.login,
      repository: payload_json.repository.name
    }
  }

  return github_event;
}
