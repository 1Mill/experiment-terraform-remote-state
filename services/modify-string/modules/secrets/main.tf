variable "file_path" {
	type = string
}

provider "sops" {
	version = "~> 0.5.1"
}

data "sops_file" "default" {
  	source_file = "${path.cwd}/${var.file_path}"
}

output "json" {
	value = jsondecode(data.sops_file.default.raw)
}
