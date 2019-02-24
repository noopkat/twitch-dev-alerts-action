workflow "Build, Tag and Push to Docker" {
  on = "push"
  resolves = ["Push Image"]
}

action "Docker Registry" {
  uses = "actions/docker/login@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Build image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD", "GITHUB_TOKEN"]
  args = "build -t  $IMAGE_NAME ."
  env = {
    IMAGE_NAME = "twitch-dev-alerts-action"
  }
}

action "Tag Image" {
  uses = "actions/docker/tag@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Docker Registry", "Build image"]
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD", "GITHUB_TOKEN"]
  args = "$IMAGE_NAME $DOCKER_USERNAME/$IMAGE_NAME --no-latest --no-sha --no-ref"
  env = {
    IMAGE_NAME = "twitch-dev-alerts-action"
  }
}

action "Push Image" {
  uses = "actions/docker/cli@8cdf801b322af5f369e00d85e9cf3a7122f49108"
  needs = ["Tag Image"]
  secrets = ["GITHUB_TOKEN", "DOCKER_USERNAME", "DOCKER_PASSWORD"]
  args = "push $DOCKER_USERNAME/$IMAGE_NAME"
  env = {
    IMAGE_NAME = "twitch-dev-alerts-action"
  }
}
