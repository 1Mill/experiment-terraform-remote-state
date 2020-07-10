// Remote state
terraform {
	required_version = "~> 0.12.26"

	backend "s3" {
		// access_key = ENVIRONMENT AWS_ACCESS_KEY_ID
		// region = ENVIRONMENT AWS_DEFAULT_REGION
		// secret_key = ENVIRONMENT AWS_SECRET_ACCESS_KEY

		bucket = "experiment-2-terraform-state"
		dynamodb_table = "experiment-1-terraform-state-locks"
		encrypt = true
		key = "terraform.tfstate"
	}
}
