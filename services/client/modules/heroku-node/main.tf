// Module inputs
variable "application_name" {
	type = string
}
variable "application_project_path" {
	type = string
}
variable "application_version" {
	type = string
}

// Required providers
module "heroku" {
	source = "../secrets"

	file_path = "/modules/heroku-node/heroku.sops.json"
}
provider "heroku" {
	api_key = module.heroku.json.APIKEY
	email = module.heroku.json.EMAIL
	version = "~> 2.5"
}

// Create, build, and release application
resource "heroku_app" "default" {
	name = var.application_name
	region = "us"
}
resource "heroku_app_config_association" "default" {
	app_id = heroku_app.default.id
	vars = {
		PROJECT_PATH = var.application_project_path
	}
}
resource "heroku_build" "default" {
	app = heroku_app.default.name
	buildpacks = [
		"https://github.com/timanovsky/subdir-heroku-buildpack",
		"https://github.com/heroku/heroku-buildpack-nodejs",
	]
	source = {
		url = "https://github.com/1Mill/experiment-terraform-remote-state/archive/${var.application_version}.tar.gz"
		version = var.application_version
	}
}
resource "heroku_formation" "default" {
	app = heroku_app.default.id
	depends_on = [ heroku_build.default ]
	quantity = 1
	size = "free"
	type = "web"
}
