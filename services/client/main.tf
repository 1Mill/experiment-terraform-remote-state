// Remote state
terraform {
	required_version = "~> 0.12.26"

	backend "s3" {
		// access_key = ENVIRONMENT AWS_ACCESS_KEY_ID
		// region = ENVIRONMENT AWS_DEFAULT_REGION
		// secret_key = ENVIRONMENT AWS_SECRET_ACCESS_KEY

		bucket = "experiment-3-terraform-state"
		dynamodb_table = "experiment-3-terraform-state-locks"
		encrypt = true
		key = "terraform.tfstate"
	}
}

// Required providers
module "heroku" {
	source = "./modules/secrets"
	file_name = "heroku.sops.json"
}
provider "heroku" {
	api_key = module.heroku.json.APIKEY
	email = module.heroku.json.EMAIL
	version = "~> 2.5"
}

// Create, build, and release application
resource "heroku_app" "default" {
	name = "services-client-ui"
	region = "us"
}
resource "heroku_app_config_association" "default" {
	app_id = heroku_app.default.id
	vars = {
		PROJECT_PATH = "services/client/ui"
	}
}
resource "heroku_build" "default" {
	app = heroku_app.default.name
	buildpacks = [
		"https://github.com/timanovsky/subdir-heroku-buildpack",
		"https://github.com/heroku/heroku-buildpack-nodejs",
	]
	source = {
		url = "https://github.com/1Mill/experiment-terraform-remote-state/archive/v0.0.6.tar.gz"
		version = "v0.0.6"
	}
}
resource "heroku_formation" "default" {
	app = heroku_app.default.id
	depends_on = [ heroku_build.default ]
	quantity = 1
	size = "free"
	type = "web"
}
