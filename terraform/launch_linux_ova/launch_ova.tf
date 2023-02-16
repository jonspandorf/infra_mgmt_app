resource "vsphere_virtual_machine" "linux_vm_ova" {

  for_each = {
    for vm in var.vm_specs : vm.vm_name => vm
  }

  name             = each.value.vm_name
  num_cpus         = each.value.vcpu
  memory           = each.value.ram
  datastore_id     = data.vsphere_datastore.datastore.id
  datacenter_id    = data.vsphere_datacenter.datacenter.id
  host_system_id   = data.vsphere_host.esxi_host[0].id
  resource_pool_id = data.vsphere_resource_pool.vcenter_rp.id
  guest_id         = each.value.guest_id

  disk {
    label            = "disk0"
    size             = each.value.storage
    thin_provisioned = true
  }

  network_interface {
    network_id   = data.vsphere_network.public_network.id
  }

  cdrom {
    client_device = true
  }

  extra_config = {
    "ethernet0.pciSlotNumber" = "${var.nic_pciSlotNumber}"
  }

  ovf_deploy {
    local_ovf_path       = "/${var.container_parent_folder}/${var.linux_image_filename}"
    ip_protocol          = "IPV4"
    ip_allocation_policy = var.is_static_ip ? "DHCP" : "STATIC_MANUAL"
    disk_provisioning    = "thin"
    ovf_network_map = {
      "Management" = data.vsphere_network.public_network.id
    }
  }

  vapp {
    properties = {
      "instance-id" = each.value.vm_name
      "hostname"    = each.value.hostname
      "user-data"   = var.is_static_ip ? base64encode(data.template_file.userdata_static[each.key].rendered) : base64encode(data.template_file.userdata_dhcp[each.key].rendered)
    }
  }
}