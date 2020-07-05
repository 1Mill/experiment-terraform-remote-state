// Remote state
terraform {
	required_version = "~> 0.12.26"

	backend "s3" {
		// access_key = ENVIRONMENT AWS_ACCESS_KEY_ID
		// region = ENVIRONMENT AWS_DEFAULT_REGION
		// secret_key = ENVIRONMENT AWS_SECRET_ACCESS_KEY

		bucket = "experiment-1-terraform-state"
		dynamodb_table = "experiment-1-terraform-state-locks"
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
	api_key = heroku.json.APIKEY
	email = heroku.json.EMAIL
	version = "~> 2.5"
}
