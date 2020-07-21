# Using terraform remote state

This application is an example of using remote terraform states across isolated applications.
Do run this project, you need:
1. Docker on your local computer
1. Mozilla SOPS installed on your local computer
1. An AWS_ACCESS_KEY_ID, AWS_DEFAULT_REGION (e.g. us-east-1), and AWS_SECRET_ACCESS_KEY keys

Steps to launch this project on Heroku:

1. Update the `.sops.yaml` file with your AWS KSM
1. Update both `heroku.sops.json` files with your Heroku credentials
1. Create both .env files for both the `client` and `modify-string` services with your AWS IAM credentials with access to your specified AWS KSM
1. Update all `main.tf` with your remote state parameters
1. Run the follow:
    1. `cd services/rapids`
    1. `docker-compose run -f ./infastructure.docker-compose.yml run terraform sh`
    1. `terraform init && terraform appy -auto-approve`
    1. You should now have a Heroku "rapids" application
1. Go to your Heroku rapids application and update `credentials.sops.json`, `urls.sops.json`, and `ddnlanm4-modify-string.2020-07-07` with your topic prefix.
1. Run the following:
  1. `cd services/client`
  1. `docker-compose run -f ./infastructure.docker-compose.yml run terraform sh`
  1. `terraform init && terraform apply -auto-approve`
  1. You should now have a "services-clients-ui" and "services-client-sockets" Heroku applications
1. Run the following:
    1. `cd services/modify-string`
    1. `docker-compose run -f ./infastructure.docker-compose.yml run terraform sh`
    1. `terraform init && terraform apply -auto-approve`
    1. You should now have a "services-modify-string" Heroku application.
1. Visit the URL provided for "services-client-ui" Heroku application in the Heroku dashboard.
1. To destroy all resources, run `terraform init && terraform destroy -auto-approve` within each service
