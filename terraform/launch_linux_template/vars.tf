variable "VCENTER_USER" {}

variable "VCENTER_PASSWD" {}

variable "VCENTER_HOST" {}

variable "vcenter_datacenter" {
  type    = string
  default = ""
}

variable "is_on_cluster" {
  type    = bool
  default = true
}


variable "bind_to_host" {
  type    = bool
  default = false
}

variable "vcenter_cluster_name" {
  type    = string
  default = ""
}

variable "container_parent_folder" {
  type    = string
  default = "/files"
}

variable "linux_image_filename" {
  type    = string
  default = "jammy-server-cloudimg-amd64.ova"
}

variable "req_host" {
  type    = string
  default = ""
}

variable "template_name" {
  type    = string
  default = "ubuntu20focaltemplate"
}

variable "datastore" {
  type    = string
  default = ""
}

variable "is_static_ip" {
  type    = bool
  default = true
}

variable "mgmt_nic" {
  type    = string 
  default = "ens160"
}

variable "mask" {
  type    = string 
  default = "24"
}

variable "nameserver1" {
  type = string 
  default = "8.8.8.8"
}

variable "nameserver2" {
  type = string 
  default = "4.4.4.4"
}

variable "requested_rp" {
  type    = string
  default = ""
}

variable "provider_network" {
  type = string
  default = "VM Network"
}

variable "nic_pciSlotNumber" {
  type = string
  default = "160"
}

variable "vm_specs" {
  type = set(object({
    vm_name   = string
    vcpu      = number
    ram       = number
    storage   = number
    username  = string
    hostname  = string
    password  = string
    static_ip = string
    dg        = string
  }))
}

