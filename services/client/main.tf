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

data "terraform_remote_state" "rapids" {
	backend = "s3"
	config = {
		// access_key = ENVIRONMENT AWS_ACCESS_KEY_ID
		// region = ENVIRONMENT AWS_DEFAULT_REGION
		// secret_key = ENVIRONMENT AWS_SECRET_ACCESS_KEY

		bucket = "experiment-1-terraform-state"
		dynamodb_table = "experiment-1-terraform-state-locks"
		encrypt = true
		key = "terraform.tfstate"
	}
}

// Create, build, and release application
module "ui" {
	source = "./modules/heroku-node"

	application_name = "services-client-ui"
	application_project_path = "services/client/ui"
	application_version = "v0.0.8"
}
module "sockets" {
	source = "./modules/heroku-node"

	application_name = "services-client-sockets"
	application_project_path = "services/client/sockets"
	application_version = "v0.0.8"
}

output "rapids_url" {
	value = data.terraform_remote_state.rapids.outputs.urls_string
}
