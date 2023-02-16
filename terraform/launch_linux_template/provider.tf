terraform {
  required_providers {
    vsphere = {
      source  = "hashicorp/vsphere"
      version = "2.1.1"
    }
  }
}

provider "vsphere" {

  user           = var.VCENTER_USER
  password       = var.VCENTER_PASSWD
  vsphere_server = var.VCENTER_HOST

  allow_unverified_ssl = true
}