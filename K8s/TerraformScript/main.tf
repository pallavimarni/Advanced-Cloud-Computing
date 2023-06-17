terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}

provider "google" {
  credentials = file("C:\\Users\\17827\\Desktop\\cloud-389618-2ce8ce4ce232.json")
  project     = "cloud-389618"
  region      = "us-central1"
}

resource "google_container_cluster" "my_cluster" {
  name               = "my-cluster"
  location           = "us-central1-c"
  initial_node_count = 1

  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 100
  }
}

resource "google_compute_disk" "my_disk" {
  name  = "my-disk"
  type  = "pd-standard"
  size  = 1
  zone  = "us-central1-c"
}

