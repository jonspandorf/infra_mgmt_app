data "vsphere_datacenter" "datacenter" {
  name = var.vcenter_datacenter
}

data "vsphere_datastore" "datastore" {
  name          = var.datastore
  datacenter_id = data.vsphere_datacenter.datacenter.id
}

data "vsphere_compute_cluster" "cluster" {
  count         = var.is_on_cluster ? 1 : 0
  name          = var.vcenter_cluster_name
  datacenter_id = data.vsphere_datacenter.datacenter.id
}

data "vsphere_host" "esxi_host" {
  count         = var.bind_to_host ? 1 : 0
  name          = var.req_host
  datacenter_id = data.vsphere_datacenter.datacenter.id
}


data "vsphere_resource_pool" "vcenter_rp" {
  name          = var.requested_rp
  datacenter_id = data.vsphere_datacenter.datacenter.id
}

data "vsphere_network" "public_network" {
  name          = var.provider_network
  datacenter_id = data.vsphere_datacenter.datacenter.id
}

