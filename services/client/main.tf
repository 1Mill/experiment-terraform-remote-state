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

// Create, build, and release application
module "client_ui" {
	source = "./modules/heroku-node"

	application_name = "services-client-ui"
	application_project_path = "services/client/ui"
	application_version = "v0.0.6"
}
module "sockets" {
	source = "./modules/heroku-node"

	application_name = "services-client-sockets"
	application_project_path = "services/client/sockets"
	application_version = "v0.0.6"
}

output "sockets_url" {
	value = module.sockets.url
}
